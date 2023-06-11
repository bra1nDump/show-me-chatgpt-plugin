import { compressAndEncodeBase64 } from "./utils";

export function actdiagEditorLink(code: string): string {
  return `http://interactive.blockdiag.com/actdiag/?compression=deflate&src=` + compressAndEncodeBase64(code)
}

export function blockdiagEditorLink(code: string): string {
  return `http://interactive.blockdiag.com/?compression=deflate&src=` + compressAndEncodeBase64(code)
}

export function nwdiagEditorLink(code: string): string {
  return `http://interactive.blockdiag.com/nwdiag/?compression=deflate&src=` + compressAndEncodeBase64(code)
}

export function rackdiagEditorLink(code: string): string {
  return `http://interactive.blockdiag.com/rackdiag/?compression=deflate&` + compressAndEncodeBase64(code)
}


