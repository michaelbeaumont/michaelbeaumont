import * as index from "./index";

describe("getLanguagesAndTopics", () => {
  it("correctly handles edge cases", () => {
    expect(index.getLanguagesAndTopics([], {})).toStrictEqual([[], []]);
  });
  it("correctly sorts languages by number of repos", () => {
    expect(
      index.getLanguagesAndTopics([
        {
          nameWithOwner: "user/ts1",
          primaryLanguage: { name: "ts", color: "blue" },
          repositoryTopics: { nodes: [] },
          isPrivate: false,
        },
        {
          nameWithOwner: "user/rust1",
          primaryLanguage: { name: "rust", color: "red" },
          repositoryTopics: { nodes: [] },
          isPrivate: false,
        },
        {
          nameWithOwner: "user/ts2",
          primaryLanguage: { name: "ts", color: "blue" },
          repositoryTopics: { nodes: [] },
          isPrivate: false,
        },
        {
          nameWithOwner: "fork/ts1",
          primaryLanguage: null,
          repositoryTopics: { nodes: [] },
          isPrivate: false,
        },
      ], {})[0]
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
      index.getLanguagesAndTopics([
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
        },
        {
          nameWithOwner: "user/rust1",
          primaryLanguage: { name: "rust", color: "red" },
          repositoryTopics: { nodes: [{ topic: { name: "z" }, url: "/z" }] },
          isPrivate: false,
        },
        {
          nameWithOwner: "fork/rust1",
          primaryLanguage: { name: "rust", color: "red" },
          repositoryTopics: { nodes: [] },
          isPrivate: false,
        },
      ], {})[1]
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
});
