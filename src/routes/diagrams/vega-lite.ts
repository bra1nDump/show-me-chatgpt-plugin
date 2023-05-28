import { compressToEncodedURIComponent } from "lz-string";

export function vegaLiteEditorLink(code: string): string {
  const buffer = compressToEncodedURIComponent(code);
  return `https://vega.github.io/editor/#/url/vega-lite/${buffer}`;
}
