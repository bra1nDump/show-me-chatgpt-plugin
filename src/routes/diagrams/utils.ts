import * as pako from 'pako'

export function compressAndEncodeBase64(input: string) {
  // Convert the input string to a Uint8Array
  const textEncoder = new TextEncoder()
  const inputUint8Array = textEncoder.encode(input)

  // Compress the Uint8Array using pako's deflate function
  const compressedUint8Array = pako.deflate(inputUint8Array) //, { level: 8 });

  // Encode the compressed Uint8Array to a Base64 string
  const base64Encoded = btoa(
    String.fromCharCode.apply(null, compressedUint8Array)
  )
    .replace(/\+/g, '-')
    .replace(/\//g, '_')

  return base64Encoded
}

export function encodeBase64(input: string) {
  // Convert the input string to a Uint8Array
  const textEncoder = new TextEncoder()
  const inputUint8Array = textEncoder.encode(input)

  // Encode the compressed Uint8Array to a Base64 string
  const base64Encoded = btoa(String.fromCharCode.apply(null, inputUint8Array))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')

  return base64Encoded
}

export const diagramLanguages = [
  "blockdiag",
  "bpmn",
  "bytefield",
  "seqdiag",
  "actdiag",
  "nwdiag",
  "packetdiag",
  "rackdiag",
  "c4-with-plantuml",
  "d2",
  "dbml",
  "ditaa",
  "erd",
  "excalidraw",
  "graphviz",
  "mermaid",
  "nomnoml",
  "pikchr",
  "plantuml",
  "structurizr",
  "svgbob",
  "umlet",
  "vega",
  "vega-lite",
  "wavedrom",
  "wireviz",
] as const;

export type DiagramLanguage = typeof diagramLanguages[number];

export const diagramTypes = [
  "sequence",
  "use-case",
  "class",
  "object",
  "activity",
  "component",
  "deployment",
  "state",
  "timing",
  "graph",
  "entity-relationship",
  "user-journey",
  "gantt",
  "pie-chart",
  "requirement",
  "gitgraph",
  "mindmap",
  "timeline-diagram",
  "block",
  "network",
  "json",
  "yaml",
  "ebnf",
  "salt-wireframe",
  "rack",
  "grid",
  "dbml",
  "uml",
  "ascii",
  "digital-timing"
] as const

export type DiagramType = typeof diagramTypes[number]

export const diagramLanguagesAndTypes: [DiagramLanguage, DiagramType[]][] = [
  ["mermaid", ["sequence", "class", "state", "graph", "entity-relationship", "user-journey", "gantt", "pie-chart", "requirement", "gitgraph", "mindmap", "timeline-diagram", ]],
  ["plantuml", ["sequence", "use-case", "class", "object", "activity", "component", "deployment", "state", "timing", "entity-relationship", "gantt", "mindmap", "network", "json", "yaml", "ebnf", "salt-wireframe"]],
  ["d2", ["sequence", "class", "graph", "entity-relationship", "grid"]],
  ["nomnoml", ["class", "activity", "graph", "entity-relationship", "uml"]],
  ["graphviz", ["graph"]],
  ["seqdiag", ["sequence"]],
  ["actdiag", ["activity"]],
  ["blockdiag", ["block"]],
  ["nwdiag", ["network"]],
  ["rackdiag", ["rack"]],
  ["dbml", ["dbml"]],
  ["erd", ["entity-relationship"]],
  ["ditaa", ["ascii"]],
  ["svgbob", ["ascii"]],
  ["wavedrom", ["digital-timing"]],
]

async function fetchSVG(link: string): Promise<string> {
  const response = await fetch(link);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.text();

  if (data.includes("Syntax error in graph")) {
    throw new Error('SVG contains "Syntax error in graph"');
  }

  return data;
}

// TODO: Add a timeout to the fetchSVG function

async function racePromise<T>(timeout: number, promise: Promise<T>): Promise<T> {
  const timeoutPromise = new Promise<T>((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Promise timed out after ${timeout}ms`));
    }, timeout);
  });

  return Promise.race([promise, timeoutPromise]);
}

export interface RenderResult {
  svg?: string, 
  error?: "kroki timed out" | "invalid syntax" | "kroki failed"
}

export async function getSVG(imageUrl: string): Promise<RenderResult> {
  try {
    const svg = await racePromise(4000, fetchSVG(imageUrl))

    console.error(
      `Rendered successfully
      Image url: ${imageUrl}
      `)

    return { svg }
  } catch (error) {
    console.error(
      `Error rendering or fetching svg: ${error}
      Image url: ${imageUrl}
      `)

    if (error.message.includes("Promise timed out after")) {
      return { error: "kroki timed out" }
    } else if (error.message.includes('SVG contains "Syntax error in graph"')) {
      return { error: "invalid syntax" }
    } else {
      return { error: "kroki failed" }
    }
  }
}

// Write a similar function for making a post to https://kroki-mermaid.fly.dev/svg
// with the contents of the mermaid diagram as the body in plain text
// HACK
// https://github.com/bra1nDump/show-me-chatgpt-plugin/issues/26
export async function HACK_postMermaidDiagram(diagram: string): Promise<{svg?: string, error?: "kroki timed out" | "invalid syntax" | "kroki failed"}> {
  try {
    const response = await racePromise(4000, fetch('https://kroki-mermaid.fly.dev/svg', {
      method: 'POST',
      body: diagram,
      headers: {
        'Content-Type': 'text/plain',
      },
    }));

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.text();

    if (data.includes("Syntax error in graph")) {
      return { error: "invalid syntax" };
    }

    return { svg: data };
  } catch (error) {
    console.error(
      `Error rendering or fetching svg: ${error}
      Mermaid diagram: ${diagram}
      `);

    if (error.message.includes("Promise timed out after")) {
      return { error: "kroki timed out" };
    } else {
      return { error: "kroki failed" };
    }
  }
}