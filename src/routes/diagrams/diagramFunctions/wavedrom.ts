import { EditorLink } from "./utils";

export function wavedromEditorLink(code: string): EditorLink {
  // todo: insert the diagram code into the editor, Currently the editor does not support URL encoding to fill automatically the code
  return {
    link: `https://wavedrom.com/editor.html`,
    canAutofillDiagramCode: false
  };
}

