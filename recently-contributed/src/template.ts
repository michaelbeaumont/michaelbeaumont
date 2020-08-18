function makeShield(message: string, color: string, link: string): string {
  if (link) {
    const img = `<img src="https://img.shields.io/static/v1?label=&message=${message}&color=${color}" alt=${message}/>`;
    return `<a href="${link}">${img}</a>`;
  } else {
    return `![${message}](https://img.shields.io/static/v1?label=&message=${message}&color=${encodeURIComponent(
      color
    )})`;
  }
}

export function joinWithFinalSep(ss: string[], sep: string, finalSep: string): string {
  const last = ss[ss.length - 1];
  const init = ss.slice(0, -1);
  return `${init.join(sep)}${init.length ? finalSep : ""}${last}`;
}

export function executeTemplate(template: string | Buffer, args: {}) {
  const vars = {
    ...args,
    makeShield,
    joinWithFinalSep,
  };
  return new Function(`return \`${template}\`;`).call(vars);
}
