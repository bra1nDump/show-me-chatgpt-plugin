import {
  DiagramLanguage,
  getSVG,
  RenderError,
} from "./utils";
import { mermaidEditorLink } from "./diagramFunctions/mermaid";
import { plantumlEditorLink } from "./diagramFunctions/plantuml";
import { graphvizEditorLink } from "./diagramFunctions/graphviz";
import { vegaLiteEditorLink } from "./diagramFunctions/vega-lite";
import { nomnomlEditorLink } from "./diagramFunctions/nomnoml";
import { actdiagEditorLink, blockdiagEditorLink, nwdiagEditorLink, rackdiagEditorLink } from "./diagramFunctions/blockdiag";
import { compressAndEncodeBase64 } from "./diagramFunctions/utils";
import { wavedromEditorLink } from "./diagramFunctions/wavedrom";
import { svgBobEditorLink } from "./diagramFunctions/svgbob";
import { dbmlEditorLink } from "./diagramFunctions/dbml";
import { d2EditorLink } from "./diagramFunctions/d2";

type DiagramDetails = {
  editorLink: string,
  isValid: boolean,
  diagramSVG?: string | null,
  error?: RenderError,
};

export async function diagramDetails(diagram: string, diagramLanguage: DiagramLanguage): Promise<DiagramDetails> {
  type DiagramFunctions = {
    editorLink: (diagram: string) => string | null
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
    editorLink: () => null,
  }
  const diagramFunctions = getDiagramFunctions[diagramLanguage] ?? defaultDiagramFunctions

  const imageUrl =
    'https://kroki.io/' +
    diagramLanguage +
    '/svg/' +
    compressAndEncodeBase64(diagram)

  console.log("imageUrl", imageUrl);

  const renderResult = await getSVG(imageUrl)


  // We always include an editor link, as most likely the issue with with rendering
  // The user will still see the diagram in the editor

  if (renderResult.error) {
    return {
      editorLink: diagramFunctions.editorLink?.(diagram) ?? "",
      isValid: false,
      error: renderResult.error,
    }
  } else {
    return {
      editorLink: diagramFunctions.editorLink?.(diagram) ?? "",
      isValid: true,
      diagramSVG: renderResult.svg,
    }
  }

}
