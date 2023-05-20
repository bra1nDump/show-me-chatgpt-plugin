import { encodeBase64 } from "./utils";

export function mermaidFormat(diagram: string): string {
  let mermaidNoPluses = diagram.replace(/\+/g, ' ')

  console.log('mermaidNoPluses before styling')
  console.log(mermaidNoPluses)

  // Breaks for other diagram styles, for instance sequence diagrams
  if (mermaidNoPluses.startsWith('graph')) {
    // TODO hoist regex to only generate once
    const MERMAID_LINK_PATTERN = /-->/g;
    const linksCount = (mermaidNoPluses.match(MERMAID_LINK_PATTERN) || []).length;
    mermaidNoPluses += '\n';
    for (let i = 0; i < linksCount; i++) {
      mermaidNoPluses += `  linkStyle ${i} stroke:#2ecd71,stroke-width:2px;\n`;
    }
  }

  console.log('mermaidNoPluses after styling')
  console.log(mermaidNoPluses)

  return mermaidNoPluses
}

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

