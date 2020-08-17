export interface GQLRepository {
  name: string;
  primaryLanguage: { name: string; color: string };
  repositoryTopics: { nodes: { url: string; topic: { name: string } }[] };
}

export interface GQLRepositoryContribution {
  repository: GQLRepository;
}

export interface GQLContributionResult {
  user: {
    contributionsCollection: {
      pullRequestContributionsByRepository: GQLRepositoryContribution[];
      commitContributionsByRepository: GQLRepositoryContribution[];
    };
  };
}

export const query = `
  query ($login: String!, $from: DateTime!){
    user(login: $login) {
      contributionsCollection(from: $from) {
       commitContributionsByRepository {
         repository {
           name
           repositoryTopics(first:2) { nodes { url, topic { name }}}
           primaryLanguage { name, color }
         }
       }
       pullRequestContributionsByRepository {
         repository {
           name
           repositoryTopics(first:2) { nodes { url, topic { name }}}
           primaryLanguage { name, color }
         }
       }
      }
    }
  }`;
