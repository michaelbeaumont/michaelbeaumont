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
           ...repoFields
         }
       }
       pullRequestContributionsByRepository {
         repository {
           ...repoFields
         }
       }
      }
    }
  }
  fragment repoFields on Repository {
    name
    repositoryTopics(first:4) { nodes { url, topic { name }}}
    primaryLanguage { name, color }
  }
  `;
