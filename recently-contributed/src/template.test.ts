import * as template from "./template";

describe("joinWithFinalSep", () => {
  it("basic test", () => {
    expect(
      template.joinWithFinalSep(["first", "second", "third"], ", ", " and ")
    ).toStrictEqual("first, second and third");
  });
});

describe("makeShield", () => {
  it("no link, no logo", () => {
    expect(template.makeShield("x", "#ffffff", "", false)).toStrictEqual(
      "![x](https://img.shields.io/static/v1?style=flat-square&label=&message=x&color=%23ffffff)"
    );
  });
  it("no link, logo", () => {
    expect(template.makeShield("x", "#000000", "", true)).toStrictEqual(
      "![x](https://img.shields.io/static/v1?logo=x&logoColor=%23fff&style=flat-square&label=&message=x&color=%23000000)"
    );
  });
  it("with light background", () => {
    expect(template.makeShield("x", "#dea584", "", true)).toStrictEqual(
      "![x](https://img.shields.io/static/v1?logo=x&logoColor=%23333&style=flat-square&label=&message=x&color=%23dea584)"
    );
  });
  it("link, no logo", () => {
    expect(
      template.makeShield("x", "#ffffff", "linkhref", false)
    ).toStrictEqual(
      '<a href="linkhref"><img src="https://img.shields.io/static/v1?style=flat-square&label=&message=x&color=%23ffffff" alt=x/></a>'
    );
  });
  it("link, logo", () => {
    expect(template.makeShield("x", "#ffffff", "linkhref", true)).toStrictEqual(
      '<a href="linkhref"><img src="https://img.shields.io/static/v1?logo=x&logoColor=%23333&style=flat-square&label=&message=x&color=%23ffffff" alt=x/></a>'
    );
  });
});
