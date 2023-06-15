import { EditorLink } from "./utils";

export function svgBobEditorLink(code: string): EditorLink {
  // todo: insert the diagram code into the editor, Currently the editor does not support URL encoding to fill automatically the code
  return {
    link: `https://ivanceras.github.io/svgbob-editor/`,
    canAutofillDiagramCode: false
  };
}

