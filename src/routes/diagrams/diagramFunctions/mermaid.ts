import { encodeBase64 } from "./utils";

export function mermaidEditorLink(code: string): string {
  const mermaidEditorJson = {
    code,
    mermaid: { theme: 'default' },
    updateEditor: false
  }
  const mermaidEditorJsonString = JSON.stringify(mermaidEditorJson)
  const buffer = encodeBase64(mermaidEditorJsonString)

  return 'https://mermaid.live/edit#' + buffer
}

