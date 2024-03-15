import { promises as fs } from "fs";
import * as github from "@actions/github";
import { Octokit } from "@octokit/core";
import { executeTemplate } from "./template";
import { Topic, Language } from "./types";
import * as api from "./api";

export function getRepositories(
  result: api.GQLContributionResult
): api.GQLRepository[] {
  const commits =
    result.user.contributionsCollection.commitContributionsByRepository;
  const prs =
    result.user.contributionsCollection.pullRequestContributionsByRepository;

  return Object.values(
    commits.concat(prs).reduce(
      (acc, contribution) => ({
        ...acc,
        [contribution.repository.nameWithOwner]: contribution.repository,
      }),
      {} as { [name: string]: api.GQLRepository }
    )
  );
}

export async function getContributions(
  octokit: Octokit,
  numDays: number
): Promise<api.GQLContributionResult> {
  const from = new Date();
  from.setDate(new Date().getDate() - numDays);
  return octokit.graphql(api.query, {
    login: github.context.repo.owner,
    from: from.toISOString(),
  });
}

export function getLanguagesAndTopics(
  repos: api.GQLRepository[],
  { skipPrivateTopics } : { skipPrivateTopics?: boolean },
): [Language[], Topic[]] {
  const languages: Language[] = Object.values(
    repos.reduce(
      (acc, { primaryLanguage: l }) => ({
        ...acc,
        ...(l
          ? {
              [l.name]: {
                name: l.name,
                color: l.color || "gray",
                count: ((acc[l.name] || {}).count || 0) + 1,
              },
            }
          : {}),
      }),
      {} as { [name: string]: Language }
    )
  ).sort(({ count: a }, { count: b }) => b - a);
  const languageSet = new Set(languages.map((l) => l.name.toLowerCase()));
  // We get more than 2 topics in our query, in case we end up filtering some out.
  if (skipPrivateTopics) {
    repos = repos.filter(r => !r.isPrivate);
  }
  const topics: Topic[] = Object.values(
    repos
      .flatMap((r) =>
        r.repositoryTopics.nodes
          .filter((t) => !languageSet.has(t.topic.name))
          .slice(0, 2)
      )
      .reduce(
        (acc, val) => ({
          ...acc,
          [val.topic.name]: {
            name: val.topic.name,
            url: val.url,
          },
        }),
        {}
      )
  );
  return [languages, topics];
}

export async function renderTemplate(
  templateFile: string,
  outputFile: string,
  vars: {}
): Promise<void> {
  const template = await fs.readFile(templateFile);
  await fs.writeFile(outputFile, executeTemplate(template, vars));
}
