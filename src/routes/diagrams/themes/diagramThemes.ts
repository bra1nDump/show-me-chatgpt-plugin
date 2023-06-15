import { DiagramLanguage } from "../utils";

export const d2Themes = [
  "default",
  "neutral-grey",
  "flagship-terrastruct",
  "cool-classics",
  "mixed-berry-blue",
  "grape-soda",
  "aubergine",
  "colorblind-clear",
  "vanilla-nitro-cola",
  "orange-creamsicle",
  "shirley-temple",
  "earth-tones",
  "everglade-green",
  "buttered-toast",
  "dark-mauve",
  "terminal",
  "terminal-grayscale",
]

// plantuml themes: https://the-lum.github.io/puml-themes-gallery
// mermaid themes: https://mermaid.js.org/config/theming.html
// d2 themes: https://d2lang.com/tour/themes
// d2 sketch: https://d2lang.com/tour/sketch
export const diagramThemes: Partial<Record<DiagramLanguage, string>> = {
  "plantuml": `
plantuml themes:
\`\`\`
none
amiga
aws-orange
black-knight
bluegray
blueprint
carbon-gray
cerulean
cerulean-outline
cloudscape-design
crt-amber
crt-green
cyborg
cyborg-outline
hacker
lightgray
mars
materia
materia-outline
metal
mimeograph
minty
mono
plain
reddress-darkblue
reddress-darkgreen
reddress-darkorange
reddress-darkred
reddress-lightblue
reddress-lightgreen
reddress-lightorange
reddress-lightred
sandstone
silver
sketchy
sketchy-outline
spacelab
spacelab-white
superhero
superhero-outline
toy
united
vibrant
\`\`\`


To use a theme use the "!theme" directive:
\`\`\`
!theme spacelab
!theme aws-orange
\`\`\`
  `,
  "mermaid": `
mermaid themes:
\`\`\`
default - This is the default theme for all diagrams.
neutral - This theme is great for black and white documents that will be printed.
dark - This theme goes well with dark-colored elements or dark-mode.
forest - This theme contains shades of green.
base - This is the only theme that can be modified. Use this theme as the base for customizations.
\`\`\`

To customize the theme of an individual diagram, use the init directive:
\`\`\`
%%{init: {'theme':'forest'}}%%
\`\`\`
  `,
  "d2": `
d2 themes:
\`\`\`
${d2Themes.join("\n")}
\`\`\`

Set the d2Theme of the render endpoint to use a theme, like:
\`\`\`
// terminal theme
{
  d2Theme: "terminal"
}

// neutral grey theme
{
  d2Theme: "neutral-grey"
}
\`\`\`

Append a "_sketch" to the theme name to get a sketchy version of the theme:
\`\`\`
// sketchy terminal theme
{
  d2Theme: "terminal_sketch"
}

// sketchy neutral grey theme
{
  d2Theme: "neutral-grey_sketch"
}
\`\`\`
  `
}
