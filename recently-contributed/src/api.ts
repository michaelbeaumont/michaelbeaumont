export interface GQLRepository {
  primaryLanguage: { name: string; color: string };
  repositoryTopics: { nodes: { url: string; topic: { name: string } }[] };
}

export interface GQLPRContribution {
  repository: GQLRepository;
}

export interface GQLContributionResult {
  user: {
    contributionsCollection: {
      pullRequestContributionsByRepository: GQLPRContribution[];
    };
  };
}

export const query = `
  query ($login: String!, $from: DateTime!){
    user(login: $login) {
      contributionsCollection(from: $from) {
       pullRequestContributionsByRepository {
         repository {
           name,
           repositoryTopics(first:2) { nodes { url, topic { name }}},
           primaryLanguage { name, color },
         }
       }
      }
    }
  }`;
