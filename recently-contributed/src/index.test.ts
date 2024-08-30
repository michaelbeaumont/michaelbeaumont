import * as index from "./index";

describe("getRepoInfo", () => {
  it("correctly handles edge cases", () => {
    expect(index.getRepoInfo([], {})).toStrictEqual([[], [], []]);
  });
  it("correctly sorts languages by number of repos", () => {
    expect(
      index.getRepoInfo(
        [
          {
            nameWithOwner: "user/ts1",
            primaryLanguage: { name: "ts", color: "blue" },
            repositoryTopics: { nodes: [] },
            isPrivate: false,
            owner: {
              __typename: "Organization",
              login: "user",
              avatarUrl: "https://google.com",
              url: "https://google.com",
            },
          },
          {
            nameWithOwner: "user/rust1",
            primaryLanguage: { name: "rust", color: "red" },
            repositoryTopics: { nodes: [] },
            isPrivate: false,
            owner: {
              __typename: "Organization",
              login: "user",
              avatarUrl: "https://google.com",
              url: "https://google.com",
            },
          },
          {
            nameWithOwner: "user/ts2",
            primaryLanguage: { name: "ts", color: "blue" },
            repositoryTopics: { nodes: [] },
            isPrivate: false,
            owner: {
              __typename: "Organization",
              login: "user",
              avatarUrl: "https://google.com",
              url: "https://google.com",
            },
          },
          {
            nameWithOwner: "fork/ts1",
            primaryLanguage: null,
            repositoryTopics: { nodes: [] },
            isPrivate: false,
            owner: {
              __typename: "Organization",
              login: "fork",
              avatarUrl: "https://google.com",
              url: "https://google.com",
            },
          },
        ],
        {},
      )[0],
    ).toStrictEqual([
      {
        color: "blue",
        count: 2,
        name: "ts",
      },
      {
        color: "red",
        count: 1,
        name: "rust",
      },
    ]);
  });
  it("correctly trims topics", () => {
    expect(
      index.getRepoInfo(
        [
          {
            nameWithOwner: "user/ts1",
            primaryLanguage: { name: "ts", color: "blue" },
            repositoryTopics: {
              nodes: [
                { topic: { name: "x" }, url: "/x" },
                { topic: { name: "ts" }, url: "/ts" },
                { topic: { name: "y" }, url: "/y" },
                { topic: { name: "other" }, url: "/other" },
              ],
            },
            isPrivate: false,
            owner: {
              __typename: "Organization",
              login: "user",
              avatarUrl: "https://google.com",
              url: "https://google.com",
            },
          },
          {
            nameWithOwner: "user/rust1",
            primaryLanguage: { name: "rust", color: "red" },
            repositoryTopics: { nodes: [{ topic: { name: "z" }, url: "/z" }] },
            isPrivate: false,
            owner: {
              __typename: "Organization",
              login: "user",
              avatarUrl: "https://google.com",
              url: "https://google.com",
            },
          },
          {
            nameWithOwner: "fork/rust1",
            primaryLanguage: { name: "rust", color: "red" },
            repositoryTopics: { nodes: [] },
            isPrivate: false,
            owner: {
              __typename: "Organization",
              login: "fork",
              avatarUrl: "https://google.com",
              url: "https://google.com",
            },
          },
        ],
        {},
      )[1],
    ).toStrictEqual([
      {
        url: "/x",
        name: "x",
      },
      {
        name: "y",
        url: "/y",
      },
      {
        name: "z",
        url: "/z",
      },
    ]);
  });
  it("correctly handles repo owners", () => {
    expect(
      index.getRepoInfo(
        [
          {
            nameWithOwner: "user/ts1",
            primaryLanguage: { name: "ts", color: "blue" },
            repositoryTopics: {
              nodes: [
                { topic: { name: "x" }, url: "/x" },
                { topic: { name: "ts" }, url: "/ts" },
                { topic: { name: "y" }, url: "/y" },
                { topic: { name: "other" }, url: "/other" },
              ],
            },
            isPrivate: false,
            owner: {
              __typename: "Organization",
              login: "user",
              avatarUrl: "https://google.com",
              url: "https://google.com",
            },
          },
          {
            nameWithOwner: "user/rust1",
            primaryLanguage: { name: "rust", color: "red" },
            repositoryTopics: { nodes: [{ topic: { name: "z" }, url: "/z" }] },
            isPrivate: false,
            owner: {
              __typename: "Organization",
              login: "user",
              avatarUrl: "https://google.com",
              url: "https://google.com",
            },
          },
          {
            nameWithOwner: "fork/rust1",
            primaryLanguage: { name: "rust", color: "red" },
            repositoryTopics: { nodes: [] },
            isPrivate: false,
            owner: {
              __typename: "Organization",
              login: "fork",
              avatarUrl: "https://google.com",
              url: "https://google.com",
            },
          },
        ],
        {},
      )[2],
    ).toStrictEqual([
      {
        login: "user",
        avatarUrl: "https://google.com",
        url: "https://google.com",
      },
      {
        login: "fork",
        avatarUrl: "https://google.com",
        url: "https://google.com",
      },
    ]);
  });
});
