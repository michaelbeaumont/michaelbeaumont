import * as util from "util";
import * as core from "@actions/core";
import * as github from "@actions/github";
import * as index from "./index";

(async function (): Promise<void> {
  const githubToken = core.getInput("github-token", { required: true });
  const numDays = parseInt(core.getInput("days"));
  const templateFile = core.getInput("template-file", { required: true });
  const outputFile = core.getInput("output-file", { required: true });
  const skipPrivateTopics = core.getInput("skip-private-topics", { required: false }) === "true";

  const octokit = github.getOctokit(githubToken);

  const contributions = await index.getContributions(octokit, numDays);
  const repositories = index.getRepositories(contributions);
  const [languages, topics] = index.getLanguagesAndTopics(repositories, skipPrivateTopics);
  core.debug(util.format("Discovered languages:", languages));
  core.debug(util.format("Discovered topics:",topics));
  await index.renderTemplate(templateFile, outputFile, { languages, topics });
})().catch((e) => {
  console.error(e);
  core.setFailed(e.toString());
});
