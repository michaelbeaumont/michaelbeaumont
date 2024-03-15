export interface GQLRepositoryLanguage {
  name: string;
  color: string | null;
}
export interface GQLRepository {
  nameWithOwner: string;
  primaryLanguage: GQLRepositoryLanguage | null;
  repositoryTopics: { nodes: { url: string; topic: { name: string } }[] };
  isPrivate: boolean;
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
    nameWithOwner
    repositoryTopics(first:4) { nodes { url, topic { name }}}
    primaryLanguage { name, color }
    isPrivate
  }
  `;
