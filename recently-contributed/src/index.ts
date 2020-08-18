import { promises as fs } from "fs";
import * as core from "@actions/core";
import * as github from "@actions/github";
import { Octokit } from "@octokit/core";
import { executeTemplate } from "./template";
import { Topic, Language } from "./types";
import * as api from "./api";

function getRepositories(
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
        [contribution.repository.name]: contribution.repository,
      }),
      {} as { [name: string]: api.GQLRepository }
    )
  );
}

async function getContributions(
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

function getLanguagesAndTopics(
  repos: api.GQLRepository[]
): [Language[], Topic[]] {
  const repoLanguages = repos
    .map((r) => r.primaryLanguage)
    .filter((x: unknown) => !!x);
  const languages: Language[] = Object.values(
    repoLanguages.reduce(
      (acc, val) => ({
        ...acc,
        [val.name]: {
          name: val.name,
          color: val.color,
          count: ((acc[val.name] || {}).count || 0) + 1,
        },
      }),
      {} as { [name: string]: Language }
    )
  ).sort(({ count: a }, { count: b }) => a - b);
  const languageSet = new Set(languages.map((l) => l.name.toLowerCase()));
  // We get more than 2 topics in our query, in case we end up filtering some out.
  const repoTopics = repos
    .flatMap((r) => r.repositoryTopics.nodes.filter((t) => !languageSet.has(t.topic.name)).slice(0, 2))
    .filter((x: unknown) => !!x);
  const topics: Topic[] = Object.values(
    repoTopics.reduce(
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

async function renderTemplate(
  templateFile: string,
  outputFile: string,
  vars: {}
): Promise<void> {
  const template = await fs.readFile(templateFile);
  await fs.writeFile(outputFile, executeTemplate(template, vars));
}

(async function (): Promise<void> {
  const githubToken = core.getInput("github-token", { required: true });
  const numDays = parseInt(core.getInput("days"));
  const templateFile = core.getInput("template-file", { required: true });
  const outputFile = core.getInput("output-file", { required: true });

  const octokit = github.getOctokit(githubToken);

  const contributions = await getContributions(octokit, numDays);
  const repositories = getRepositories(contributions);
  const [languages, topics] = getLanguagesAndTopics(repositories);
  await renderTemplate(templateFile, outputFile, { languages, topics });
})().catch((e) => {
  console.error(e);
  core.setFailed(e.toString());
});
