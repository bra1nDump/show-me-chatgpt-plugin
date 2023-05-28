export function graphvizEditorLink(code: string): string {
  const graphvizEditorJSON = {
    dot: code
  }

  const buffer = encodeURIComponent(JSON.stringify(graphvizEditorJSON))

  return 'https://www.devtoolsdaily.com/graphviz/?#' + buffer
}

