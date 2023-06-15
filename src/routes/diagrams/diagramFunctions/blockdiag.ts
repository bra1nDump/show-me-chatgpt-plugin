import { compressAndEncodeBase64, EditorLink } from "./utils";

export function actdiagEditorLink(code: string): EditorLink {
  return {
    link: `http://interactive.blockdiag.com/actdiag/?compression=deflate&src=${compressAndEncodeBase64(code)}`,
    canAutofillDiagramCode: true
  }
}

export function blockdiagEditorLink(code: string): EditorLink {
  return {
    link: `http://interactive.blockdiag.com/?compression=deflate&src=${compressAndEncodeBase64(code)}`,
    canAutofillDiagramCode: true
  }
}

export function nwdiagEditorLink(code: string): EditorLink {
  return {
    link: `http://interactive.blockdiag.com/nwdiag/?compression=deflate&src=${compressAndEncodeBase64(code)}`,
    canAutofillDiagramCode: true
  }
}

export function rackdiagEditorLink(code: string): EditorLink {
  return {
    link: `http://interactive.blockdiag.com/rackdiag/?compression=deflate&${compressAndEncodeBase64(code)}`,
    canAutofillDiagramCode: true
  }
}


