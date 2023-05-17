import { compressAndEncodeBase64, DiagramLanguage, syntaxIsValid } from "./utils";
import { mermaidDiagramType, mermaidEditorLink, mermaidFormat } from "./mermaid";
import { plantumlEditorLink } from "./plantuml";

type DiagramDetails = {
  type: string,
  editorLink: string,
  isValid: boolean,
  imageUrl: string,
};

export async function diagramDetails(diagram: string, diagramLanguage: DiagramLanguage): Promise<DiagramDetails> {
  type DiagramFunctions = {
    type: ((diagram: string) => string) | null,
    format: ((diagram: string) => string) | null,
    editorLink: (diagram: string) => string | null
    isValid: (imageUrl: string) => Promise<boolean>,
  };

  const getDiagramFunctions: Partial<Record<DiagramLanguage, DiagramFunctions>> = {
    "mermaid": {
      type: mermaidDiagramType,
      format: mermaidFormat,
      editorLink: mermaidEditorLink,
      isValid: syntaxIsValid,
    },
    "plantuml": {
      type: null,
      format: null,
      editorLink: plantumlEditorLink,
      isValid: syntaxIsValid,
    },
    // TODO: add other diagram languages
  }

  const defaultDiagramFunctions: DiagramFunctions = {
    type: null,
    format: null,
    editorLink: null,
    isValid: syntaxIsValid,
  }
  const diagramFunctions = getDiagramFunctions[diagramLanguage] ?? defaultDiagramFunctions

  const formattedDiagram = diagramFunctions.format?.(diagram) ?? diagram;

  const imageUrl =
    'https://kroki.io/' +
    diagramLanguage +
    '/svg/' +
    compressAndEncodeBase64(formattedDiagram)

  return {
    type: diagramFunctions.type?.(formattedDiagram) ?? "unknown",
    editorLink: diagramFunctions.editorLink?.(formattedDiagram) ?? "",
    isValid: await diagramFunctions.isValid(imageUrl),
    imageUrl
  }
}

