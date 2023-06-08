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
  "vegalite",
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
  "timeline",
  "block",
  "network",
  "json",
  "yaml",
  "salt-wireframe",
  "rack",
  "grid",
  "dbml",
  "ascii",
  "digital-timing",
  "line-chart",
  "bar-chart",
  "histogram"
] as const

export type DiagramType = typeof diagramTypes[number]

async function fetchSVG(link: string): Promise<string> {
  const response = await fetch(link);
  const data = await response.text();

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}. Render error: \`${data}\``);
  }
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

export type RenderError = {
  type: "kroki timed out" | "invalid syntax" | "kroki failed",
  invalidSyntax?: string;
}

export interface RenderResult {
  svg?: string,
  error?: RenderError
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
      return { error: { type: "kroki timed out" } }
    } else if (error.message.includes('SVG contains "Syntax error in graph"') || error.message.includes('HTTP error!')) {
      return { error: { type: "invalid syntax", invalidSyntax: error.message } }
    } else {
      return { error: { type: "kroki failed" } }
    }
  }
}

// Write a similar function for making a post to https://kroki-mermaid.fly.dev/svg
// with the contents of the mermaid diagram as the body in plain text
// HACK
// https://github.com/bra1nDump/show-me-chatgpt-plugin/issues/26
export async function HACK_postMermaidDiagram(diagram: string): Promise<{
  svg?: string,
  error?: "kroki timed out" | "invalid syntax" | "kroki failed"
}> {
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
