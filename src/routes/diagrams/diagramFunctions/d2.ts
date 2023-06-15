import { EditorLink } from "./utils";

export function d2EditorLink(code: string): EditorLink {
  // todo: insert the diagram into the editor, I tried to replicate it but the encoding part is written in go
  // it may be useful to look at d2 go code: https://github.com/terrastruct/d2/blob/69ee4a9033cc4941ab84f091dcf69260093aac32/lib/urlenc/urlenc.go#L38
  // also the playground part: https://github.com/terrastruct/d2-playground/blob/2f64a0be3bc37305da5cf4e2127c7be63f2f1ffb/src/js/modules/editor.js#L190
  return {
    link: `https://play.d2lang.com/`,
    canAutofillDiagramCode: false
  }
}

