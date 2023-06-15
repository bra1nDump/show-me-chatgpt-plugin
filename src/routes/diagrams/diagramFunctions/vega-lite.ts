import { compressToEncodedURIComponent } from "lz-string";
import { EditorLink } from "./utils";

export function vegaLiteEditorLink(code: string): EditorLink {
  const buffer = compressToEncodedURIComponent(code);
  return {
    link: `https://vega.github.io/editor/#/url/vega-lite/${buffer}`,
    canAutofillDiagramCode: true
  };
}
