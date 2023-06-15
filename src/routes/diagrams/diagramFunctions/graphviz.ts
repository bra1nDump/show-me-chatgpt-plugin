import { EditorLink } from "./utils";

export function graphvizEditorLink(code: string): EditorLink {
  const graphvizEditorJSON = {
    dot: code
  }

  const buffer = encodeURIComponent(JSON.stringify(graphvizEditorJSON))

  return {
    link: `https://www.devtoolsdaily.com/graphviz/?#${buffer}`,
    canAutofillDiagramCode: true
  }
}

