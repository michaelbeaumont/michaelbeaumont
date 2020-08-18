import * as template from "./template";

describe("joinWithFinalSep", () => {
  it("basic test", () => {
    expect(
      template.joinWithFinalSep(["first", "second", "third"], ", ", " and ")
    ).toStrictEqual("first, second and third");
  });
});

