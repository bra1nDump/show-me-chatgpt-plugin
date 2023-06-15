import { EditorLink } from "./utils";

export function nomnomlEditorLink(code: string): EditorLink {
  return {
    link: `https://www.nomnoml.com/#view/${encodeURIComponent(code)}`,
    canAutofillDiagramCode: true
  }
}

