import { DiagramLanguage, getSVG, RenderError, linkWithQueryParams, } from "./utils";
import { mermaidEditorLink } from "./diagramFunctions/mermaid";
import { plantumlEditorLink } from "./diagramFunctions/plantuml";
import { graphvizEditorLink } from "./diagramFunctions/graphviz";
import { vegaLiteEditorLink } from "./diagramFunctions/vega-lite";
import { nomnomlEditorLink } from "./diagramFunctions/nomnoml";
import {
  actdiagEditorLink,
  blockdiagEditorLink,
  nwdiagEditorLink,
  rackdiagEditorLink
} from "./diagramFunctions/blockdiag";
import { compressAndEncodeBase64, EditorLink } from "./diagramFunctions/utils";
import { wavedromEditorLink } from "./diagramFunctions/wavedrom";
import { svgBobEditorLink } from "./diagramFunctions/svgbob";
import { dbmlEditorLink } from "./diagramFunctions/dbml";
import { d2EditorLink } from "./diagramFunctions/d2";
import { DiagramOptions } from "../Diagram";
import { d2Themes } from "./themes/diagramThemes";

function insertDiagramOptionsIfNeeded(link: string, diagramLanguage: DiagramLanguage, diagramOptions: DiagramOptions): {
  imageUrl: string,
  isInvalidD2Theme?: boolean
} {
  if (diagramLanguage === "d2" && diagramOptions.d2Theme) {
    const theme = diagramOptions.d2Theme.split("_")[0];
    const useSketch = !!diagramOptions.d2Theme.split("_")[1];
    if (!d2Themes.includes(theme)) {
      return {
        imageUrl: "",
        isInvalidD2Theme: true
      }
    }

    return {
      imageUrl: linkWithQueryParams(link, {
        theme,
        ...useSketch && { sketch: "" } // kroki flag for sketch is empty string ("")
      }),
    }
  }

  return {
    imageUrl: link,
  }
}

type DiagramDetails = {
  editorLink: EditorLink | null,
  isValid: boolean,
  diagramSVG?: string | null,
  error?: RenderError,
};

const defaultEditorLink = {
  link: "",
  canAutofillDiagramCode: false,
};

export async function diagramDetails(diagram: string, diagramLanguage: DiagramLanguage, diagramOptions: DiagramOptions): Promise<DiagramDetails> {
  type DiagramFunctions = {
    editorLink: (diagram: string) => EditorLink
  };

  const getDiagramFunctions: Partial<Record<DiagramLanguage, DiagramFunctions>> = {
    "mermaid": {
      editorLink: mermaidEditorLink,
    },
    "plantuml": {
      editorLink: plantumlEditorLink,
    },
    "graphviz": {
      editorLink: graphvizEditorLink,
    },
    "d2": {
      editorLink: d2EditorLink,
    },
    "vegalite": {
      editorLink: vegaLiteEditorLink,
    },
    "nomnoml": {
      editorLink: nomnomlEditorLink
    },
    "actdiag": {
      editorLink: actdiagEditorLink
    },
    "blockdiag": {
      editorLink: blockdiagEditorLink
    },
    "nwdiag": {
      editorLink: nwdiagEditorLink
    },
    "rackdiag": {
      editorLink: rackdiagEditorLink
    },
    "dbml": {
      editorLink: dbmlEditorLink
    },
    "svgbob": {
      editorLink: svgBobEditorLink
    },
    "wavedrom": {
      editorLink: wavedromEditorLink,
    }
  }

  const defaultDiagramFunctions: DiagramFunctions = {
    editorLink: () => defaultEditorLink,
  }
  const diagramFunctions = getDiagramFunctions[diagramLanguage] ?? defaultDiagramFunctions

  const { imageUrl, isInvalidD2Theme } =
    insertDiagramOptionsIfNeeded(
      `https://kroki.io/${diagramLanguage}/svg/${compressAndEncodeBase64(diagram)}`
      , diagramLanguage, diagramOptions)
  console.log("imageUrl", imageUrl);
  
  if (isInvalidD2Theme) {
    return {
      editorLink: defaultEditorLink,
      isValid: false,
      error: {
        type: "invalid syntax",
        invalidSyntax: `Invalid theme: ${diagramOptions.d2Theme}`,
      },
    }
  }
  
  let rednerResult: RenderResult
  if (diagramLanguage === "mermaid") {
    console.log("HACK: bypassing kroki.io for mermaid diagrams, going directly to kroki-mermaid.fly.dev")
    rednerResult = await HACK_postMermaidDiagram(diagram)
  } else {
    rednerResult = await getSVG(imageUrl);
  }

  const editorLink = diagramFunctions.editorLink?.(diagram)

  // We always include an editor link, as most likely the issue with with rendering
  // The user will still see the diagram in the editor

  if (renderResult.error) {
    return {
      editorLink,
      isValid: false,
      error: renderResult.error,
    }
  } else {
    return {
      editorLink,
      isValid: true,
      diagramSVG: renderResult.svg,
    }
  }

}
