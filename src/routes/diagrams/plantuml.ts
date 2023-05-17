function encodeHex(input: string): string {
  const textEncoder = new TextEncoder();
  return Array
    .from(textEncoder.encode(input))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

export function plantumlEditorLink(code: string): string {
  const buffer = encodeHex(code)

  return 'https://www.plantuml.com/plantuml/uml/~h' + buffer
}

