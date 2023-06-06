import {
  compressAndEncodeBase64,
  DiagramLanguage,
  getSVG,
} from "./utils";
import { mermaidEditorLink } from "./mermaid";
import { plantumlEditorLink } from "./plantuml";
import { graphvizEditorLink } from "./graphviz";
import { vegaLiteEditorLink } from "./vega-lite";
import { nomnomlEditorLink } from "./nomnoml";
import { actdiagEditorLink, blockdiagEditorLink, nwdiagEditorLink, rackdiagEditorLink } from "./actdiag";

type DiagramDetails = {
  editorLink: string,
  isValid: boolean,
  diagramSVG?: string | null,
  error?: "kroki timed out" | "invalid syntax" | "kroki failed",
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
