import { Org } from "./types";

const cssColorConverter = require("css-color-converter");

const brightnessThreshold = 0.69;

const logos: { [k: string]: string } = {
  Shell: "gnu bash",
  shell: "gnu bash",
};

function getLogoName(text: string): string {
  return encodeURIComponent(logos[text] ?? text);
}

function brightness(color: string) {
  if (color) {
    const rgb = cssColorConverter.fromString(color).toRgbaArray();
    if (rgb) {
      return +((rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 255000).toFixed(
        2,
      );
    }
  }
  return 0;
}

function colorsForBackground(color: string): {
  textColor: string;
  shadowColor: string;
} {
  if (brightness(color) <= brightnessThreshold) {
    return {
      textColor: "#fff",
      shadowColor: "#010101",
    };
  }
  return {
    textColor: "#333",
    shadowColor: "#ccc",
  };
}

export function makeOrgTable(orgs: Org[]): string {
  const mkImg = (org: Org) =>
    `<img width="100" src="${org.avatarUrl}" alt=${org.login}/>`;
  return `
<table>
  <tbody>
    <tr>
    ${joinWithFinalSep(
      orgs.map(
        (org) =>
          `<td align="center"><a href="${org.url}">${mkImg(org)}</a></td>`,
      ),
      "\n",
      "\n",
    )}
    </tr>
    <tr>
    ${joinWithFinalSep(
      orgs.map(
        (org) => `<td align="center"><strong>${org.login}</strong></td>`,
      ),
      "\n",
      "\n",
    )}
    </tr>
  </tbody>
</table>
`;
}

export function makeShield(
  message: string,
  color: string,
  link: string,
  useLogo: boolean = false,
): string {
  const params = [
    useLogo
      ? [
          ["logo", getLogoName(message)],
          [
            "logoColor",
            encodeURIComponent(colorsForBackground(color).textColor),
          ],
        ]
      : [],
    [
      ["style", "flat-square"],
      ["label", ""],
      ["message", message],
      ["color", encodeURIComponent(color)],
    ],
  ]
    .flat()
    .map((comps) => comps.join("="))
    .join("&");
  if (link) {
    const img = `<img src="https://img.shields.io/static/v1?${params}" alt=${message}/>`;
    return `<a href="${link}">${img}</a>`;
  } else {
    return `![${message}](https://img.shields.io/static/v1?${params})`;
  }
}

export function joinWithFinalSep(
  ss: string[],
  sep: string,
  finalSep: string,
): string {
  const last = ss[ss.length - 1];
  const init = ss.slice(0, -1);
  return `${init.join(sep)}${init.length ? finalSep : ""}${last ? last : ""}`;
}

export function executeTemplate(template: string | Buffer, args: {}) {
  const vars = {
    ...args,
    makeShield,
    makeOrgTable,
    joinWithFinalSep,
  };
  return new Function(`return \`${template}\`;`).call(vars);
}
