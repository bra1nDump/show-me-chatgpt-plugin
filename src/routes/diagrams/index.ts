import { compressAndEncodeBase64, DiagramLanguage, getSVG } from "./utils";
import { mermaidEditorLink, mermaidFormat } from "./mermaid";
import { plantumlEditorLink } from "./plantuml";

type DiagramDetails = {
  editorLink: string,
  isValid: boolean,
  diagramSVG: string,
};

export async function diagramDetails(diagram: string, diagramLanguage: DiagramLanguage): Promise<DiagramDetails> {
  type DiagramFunctions = {
    format: ((diagram: string) => string) | null,
    editorLink: (diagram: string) => string | null
  };

  const getDiagramFunctions: Partial<Record<DiagramLanguage, DiagramFunctions>> = {
    "mermaid": {
      format: mermaidFormat,
      editorLink: mermaidEditorLink,
    },
    "plantuml": {
      format: null,
      editorLink: plantumlEditorLink,
    },
    // TODO: add other diagram languages
  }

  const defaultDiagramFunctions: DiagramFunctions = {
    format: null,
    editorLink: null,
  }
  const diagramFunctions = getDiagramFunctions[diagramLanguage] ?? defaultDiagramFunctions

  const formattedDiagram = diagramFunctions.format?.(diagram) ?? diagram;

  const imageUrl =
    'https://kroki.io/' +
    diagramLanguage +
    '/svg/' +
    compressAndEncodeBase64(formattedDiagram)

  const diagramSVG = await getSVG(imageUrl);

  return {
    editorLink: diagramFunctions.editorLink?.(formattedDiagram) ?? "",
    isValid: Boolean(diagramSVG),
    diagramSVG
  }
}

