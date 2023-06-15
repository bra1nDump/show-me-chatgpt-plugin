import { encodeBase64, EditorLink } from "./utils";

export function mermaidEditorLink(code: string): EditorLink {
  const mermaidEditorJson = {
    code,
    mermaid: { theme: 'default' },
    updateEditor: false
  }
  const mermaidEditorJsonString = JSON.stringify(mermaidEditorJson)
  const buffer = encodeBase64(mermaidEditorJsonString)

  return {
    link: `https://mermaid.live/edit#${buffer}`,
    canAutofillDiagramCode: true
  }
}

