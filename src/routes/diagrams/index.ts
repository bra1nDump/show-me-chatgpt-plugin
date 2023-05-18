import { compressAndEncodeBase64, DiagramLanguage, getSVG } from "./utils";
import { mermaidDiagramType, mermaidEditorLink, mermaidFormat } from "./mermaid";
import { plantumlEditorLink } from "./plantuml";

type DiagramDetails = {
  type: string,
  editorLink: string,
  isValid: boolean,
  diagramSVG: string,
};

export async function diagramDetails(diagram: string, diagramLanguage: DiagramLanguage): Promise<DiagramDetails> {
  type DiagramFunctions = {
    type: ((diagram: string) => string) | null,
    format: ((diagram: string) => string) | null,
    editorLink: (diagram: string) => string | null
  };

  const getDiagramFunctions: Partial<Record<DiagramLanguage, DiagramFunctions>> = {
    "mermaid": {
      type: mermaidDiagramType,
      format: mermaidFormat,
      editorLink: mermaidEditorLink,
    },
    "plantuml": {
      type: null,
      format: null,
      editorLink: plantumlEditorLink,
    },
    // TODO: add other diagram languages
  }

  const defaultDiagramFunctions: DiagramFunctions = {
    type: null,
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
    type: diagramFunctions.type?.(formattedDiagram) ?? "unknown",
    editorLink: diagramFunctions.editorLink?.(formattedDiagram) ?? "",
    isValid: Boolean(diagramSVG),
    diagramSVG
  }
}

