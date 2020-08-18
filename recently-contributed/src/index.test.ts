import * as index from "./index";

describe("getLanguagesAndTopics", () => {
  it("correctly handles edge cases", () => {
    expect(index.getLanguagesAndTopics([])).toStrictEqual([[], []]);
  });
  it("correctly sorts languages by number of repos", () => {
    expect(
      index.getLanguagesAndTopics([
        {
          name: "ts1",
          primaryLanguage: { name: "ts", color: "blue" },
          repositoryTopics: { nodes: [] },
        },
        {
          name: "rust1",
          primaryLanguage: { name: "rust", color: "red" },
          repositoryTopics: { nodes: [] },
        },
        {
          name: "ts2",
          primaryLanguage: { name: "ts", color: "blue" },
          repositoryTopics: { nodes: [] },
        },
      ])[0]
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
          name: "ts1",
          primaryLanguage: { name: "ts", color: "blue" },
          repositoryTopics: {
            nodes: [
              { topic: { name: "x" }, url: "/x" },
              { topic: { name: "ts" }, url: "/ts" },
              { topic: { name: "y" }, url: "/y" },
              { topic: { name: "other" }, url: "/other" },
            ],
          },
        },
        {
          name: "rust1",
          primaryLanguage: { name: "rust", color: "red" },
          repositoryTopics: { nodes: [{ topic: { name: "z" }, url: "/z" }] },
        },
      ])[1]
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
