export function getSurnameUrl(name: string): string {
  return `/last-name/${name.toLowerCase().trim()}`;
}

export function getSurnameAbsoluteUrl(name: string): string {
  return `https://howmanyofme.co${getSurnameUrl(name)}`;
}
