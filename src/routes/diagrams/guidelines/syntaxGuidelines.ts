import { DiagramLanguage, DiagramType } from "../utils";

// These guidelines for graphs can be extended to the other types of diagrams of d2
const d2GraphGuidelines = `
Simple hello world example:
\`\`\`
x -> y: hello world
\`\`\`

# Basics
You can declare shapes like so:
\`\`\`
imAShape
im_a_shape
im a shape
i'm a shape
# notice that one-hyphen is not a connection
# whereas, \`a--shape\` would be a connection
a-shape
\`\`\`

By default, a shape's label is the same as the shape's key. But if you want it to be different, assign a new label like so:
\`\`\`
pg: PostgreSQL
\`\`\`

By default, a shape's type is rectangle. To specify otherwise, provide the field shape:
\`\`\`
Cloud: my cloud
Cloud.shape: cloud
\`\`\`

Example:
\`\`\`
pg: PostgreSQL
Cloud: my cloud
Cloud.shape: cloud
SQLite; Cassandra
\`\`\`

More info:
- Keys are case-insensitive, so postgresql and postgreSQL will reference the same shape.

## Shape Catalog:
rectangle
square
page
parallelogram
document
cylinder
queue
package
step
callout
stored_data
person
diamond
oval
circle
hexagon
cloud

## Special shape types (more on these next):
text
code
class
sql_table
image
sequence_diagram

# Connections
## Basics
Hyphens/arrows in between shapes define a connection. 

\`\`\`
Write Replica Canada <-> Write Replica Australia

Read Replica <- Master
Write Replica -> Master

Read Replica 1 -- Read Replica 2
\`\`\`

More info:
There are 4 valid ways to define a connection:
--
->
<-
<->

## Connection labels
\`\`\`
Read Replica 1 -- Read Replica 2: Kept in sync
\`\`\`

## Connections must reference a shape's key, not its label.
\`\`\`
be: Backend
fe: Frontend

## This would create new shapes
Backend -> Frontend

# This would define a connection over existing labels
be -> fe
\`\`\`

Example:
\`\`\`
Write Replica Canada <-> Write Replica Australia

Read Replica <- Master

x -- y

super long shape id here --\\
  -> super long shape id even longer here
\`\`\`

## Repeated connections
\`\`\`
Database -> S3: backup
Database -> S3
Database -> S3: backup
\`\`\`

## Connection chaining
For readability, it may look more natural to define multiple connection in a single line.
\`\`\`
# The label applies to each connection in the chain.
High Mem Instance -> EC2 <- High CPU Instance: Hosted By
\`\`\`

## Cycles are okay
\`\`\`
Stage One -> Stage Two -> Stage Three -> Stage Four
Stage Four -> Stage One: repeat
\`\`\`

## Referencing connections
You can reference a connection by specifying the original ID followed by its index.
\`\`\`
x -> y: hi
x -> y: hello

(x -> y)[0].style.stroke: red
(x -> y)[1].style.stroke: blue
\`\`\`

# Containers
\`\`\`
server
# Declares a shape inside of another shape
server.process

# Can declare the container and child in same line
im a parent.im a child

# Since connections can also declare keys, this works too
apartment.Bedroom.Bathroom -> office.Spare Room.Bathroom: Portal
\`\`\`

## Nested syntax
You can avoid repeating containers by creating nested maps.
\`\`\`
clouds: {
  aws: {
    load_balancer -> api
    api -> db
  }
  gcloud: {
    auth -> db
  }

  gcloud -> aws
}
\`\`\`

# Text
## Standalone text is Markdown
\`\`\`
explanation: |md
  # I can do headers
  - lists
  - lists

  And other normal markdown stuff
|
\`\`\`

## LaTeX
\`\`\`
plankton -> formula: will steal
formula: {
  equation: |latex
    \\\\lim_{h \\\\rightarrow 0 } \\\\frac{f(x+h)-f(x)}{h}
  |
}
\`\`\`

A few things to note about LaTeX blocks:
* You must escape \\, as these are escape characters. Note the usage of \\\\ in the above example.
* LaTeX blocks do not respect font-size styling. Instead, you must style these inside the Latex script itself with commands
  * \\tiny{ }
  * \\small{ }
  * \\normal{ }
  * \\large{ }
  * \\huge{ }
* Under the hood, this is using MathJax. It is not full LaTeX (full LaTeX includes a document layout engine). D2's LaTeX blocks are meant to display mathematical notation, but not support the format of existing LaTeX documents. See here for a list of all supported commands.

## Code
Change md to a programming language for code blocks
\`\`\`
explanation: |go
  awsSession := From(c.Request.Context())
  client := s3.New(awsSession)

  ctx, cancelFn := context.WithTimeout(c.Request.Context(), AWS_TIMEOUT)
  defer cancelFn()
|
\`\`\`
`;

const nomnomlGraphGuidelines = `
Simple hello world example:
\`\`\`
[Hello]-[World!]
\`\`\`

To make the diagram flow vertically:
\`\`\`
#direction: down
[Hello]->[World!]
\`\`\`

# Association types
\`\`\`
-    association
->   association
<->  association
-->  dependency
<--> dependency
-:>  generalization
<:-  generalization
--:> implementation
<:-- implementation
+-   composition
+->  composition
o-   aggregation
o->  aggregation
-o)  ball and socket
o<-) ball and socket
->o  ball and socket
--   note
-/-  hidden
\`\`\`

# Classifier types
\`\`\`
[name]
[<abstract> name]
[<instance> name]
[<reference> name]
[<note> name]
[<package> name]
[<frame> name]
[<database> name]
[<pipe> name]
[<start> name]
[<end> name]
[<state> name]
[<choice> name]
[<sync> name]
[<input> name]
[<lollipop> lollipop]
[<sender> name]
[<socket> socket]
[<receiver> name]
[<transceiver> name]
[<actor> name]
[<usecase> name]
[<label> name]
[<hidden> name]
[<table> name| a | 5 || b | 7]
\`\`\`

# Directives
\`\`\`
#import: my-common-styles.nomnoml
#arrowSize: 1
#bendSize: 0.3
#direction: down | right
#gutter: 5
#edgeMargin: 0
#gravity: 1
#edges: hard | rounded
#background: transparent
#fill: #eee8d5; #fdf6e3
#fillArrows: false
#font: Calibri
#fontSize: 12
#leading: 1.25
#lineWidth: 3
#padding: 8
#spacing: 40
#stroke: #33322E
#title: filename
#zoom: 1
#acyclicer: greedy
#ranker: network-simplex | tight-tree | longest-path
\`\`\`

# Custom classifier styles
A directive that starts with "." define a classifier style. The style is written as a space separated list of modifiers and key/value pairs.
\`\`\`
#.box: fill=#8f8 dashed
#.blob: visual=ellipse title=bold
[<box> GreenBox]
[<blob> HideousBlob]
\`\`\`

Modifiers
\`\`\`
dashed
empty
\`\`\`

Key/value pairs
\`\`\`
fill=(any css color)

stroke=(any css color)

align=center
align=left

direction=right
direction=down

visual=actor
visual=class
visual=database
visual=ellipse
visual=end
visual=frame
visual=hidden
visual=input
visual=none
visual=note
visual=package
visual=pipe
visual=receiver
visual=rhomb
visual=roundrect
visual=sender
visual=start
visual=table
visual=transceiver
\`\`\`

Style title and text body with a comma separated list of text modifiers
\`\`\`
title=left,italic,bold
body=center,italic,bold
\`\`\`

Text modifiers
\`\`\`
bold
center
italic
left
underline
\`\`\`
`;
export const syntaxGuidelines: Partial<Record<DiagramLanguage, Partial<Record<DiagramType, string>>>> = {
  "mermaid": {
    "graph": `
Important rules when creating the graph diagram in mermaid syntax:
- Prefer using graph TB types of diagrams.
- Never use the ampersand (&) symbol in the diagram, it will break the diagram. Use the word "and" instead. For example use "User and Admin" instead of "User & Admin".
- Never use round brackets () in the node identifiers, node labels and edge labels, it will break the diagram. Use a coma instead. For example use "User, Admin" instead of "User (Admin)".
- Don't use empty labels "" for edges, instead don't label the edge at all. For example U["User"] --> A["Admin"].
- By default all the edges/links must be green, unless the user asks for it. By using "linkStyle {x} stroke:#2ecd71,stroke-width:2px;"

Rules when using graph diagrams in mermaid syntax:
- Use short node identifiers, for example U for User or FS for File System.
- Always use double quotes for node labels, for example U["User"].
- Always use double quotes for edge labels, for example U["User"] -- "User enters email" --> V["Verification"].
- Indentation is very important, always indent according to the examples below.

Rules when using graph diagrams with subgraphs in mermaid syntax:
Never refer to the subgraph root node from within the subgraph itself.

For example this is wrong subgraph usage:
\`\`\`
graph TB
  subgraph M["Microsoft"]
    A["Azure"]
    M -- "Invested in" --> O
  end
  
  subgraph O["AI"]
    C["Chat"]
  end
\`\`\`

In this diagram M is referenced from within the M subgraph, this will break the diagram.
Never reference the subgraph node identifier from within the subgraph itself.
Instead move any edges that connect the subgraph with other nodes or subgraphs outside of the subgraph like so.

Correct subgraph usage:
\`\`\`
graph TB
  subgraph M["Microsoft"]
    A["Azure"]
  end

  M -- "Invested in" --> O
  
  subgraph O["OpenAI"]
    C["ChatGPT"]
  end
\`\`\`

Examples:
User asks: "Show me how vscode internals work."
\`\`\`
graph TB
  U["User"] -- "File Operations" --> FO["File Operations"]
  U -- "Code Editor" --> CE["Code Editor"]
  FO -- "Manipulation of Files" --> FS["FileSystem"]
  FS -- "Write/Read" --> D["Disk"]
  FS -- "Compress/Decompress" --> ZL["ZipLib"]
  FS -- "Read" --> IP["INIParser"]
  CE -- "Create/Display/Edit" --> WV["Webview"]
  CE -- "Language/Code Analysis" --> VCA["VSCodeAPI"]
  VCA -- "Talks to" --> VE["ValidationEngine"]
  WV -- "Render UI" --> HC["HTMLCSS"]
  VE -- "Decorate Errors" --> ED["ErrorDecoration"]
  VE -- "Analyze Document" --> TD["TextDocument"]
\`\`\`

User asks: "Draw me a mindmap for beer brewing. Maximum of 4 nodes"
\`\`\`
graph TB
  B["Beer"]
  B --> T["Types"]
  B --> I["Ingredients"]
  B --> BP["Brewing Process"]
\`\`\`

User asks:
"Computing backend data services is a distributed system made of multiple microservices.

A web browser sends an HTTP api request to the load balancer.
The load balancer sends the http request to the crossover service.
Crossover talks to redis and mysql database.
Crossover makes a downstream API request to multiplex to submit the query which returns a job id to crossover.
Then crossover makes a long poll API request to evaluator to get the results of the job.
Then evaluator makes an API call to multiplex to check the status of the job.
Once evaluator gets a successful status response from multiplex, then evaluator makes a third API call to result-fetcher service to download the job results from S3 or GCP cloud buckets.
The result is streamed back through evaluator to crossover.

Crossover post processes the result and returns the API response to the client.

Draw me a diagram of this system"

\`\`\`
graph TB
  A["Web Browser"] -- "HTTP API Request" --> B["Load Balancer"]
  B -- "HTTP Request" --> C["Crossover"]
  C -- "Talks to" --> D["Redis"]
  C -- "Talks to" --> E["MySQL"]
  C -- "Downstream API Request" --> F["Multiplex"]
  F -- "Returns Job ID" --> C
  C -- "Long Poll API Request" --> G["Evaluator"]
  G -- "API Call" --> F
  G -- "API Call" --> H["Result-Fetcher"]
  H -- "Downloads Results" --> I["S3 or GCP Cloud Buckets"]
  I -- "Results Stream" --> G
  G -- "Results Stream" --> C
  C -- "API Response" --> A
\`\`\`

Sometimes you will need to revise the same diagram based on user feedback.
For the last example the user might make a followup request:

User followup ask:
"Crossover post processes the result and returns the API response to the client through the load balancer.

Draw the crossover node in green"

\`\`\`
query: "graph TB
  A["Web Browser"] -- "HTTP API Request" --> B["Load Balancer"]
  B -- "HTTP Request" --> C["Crossover"]
  style C fill:#99cc99
  C -- "Talks to" --> D["Redis"]
  C -- "Talks to" --> E["MySQL"]
  C -- "Downstream API Request" --> F["Multiplex"]
  F -- "Returns Job ID" --> C
  C -- "Long Poll API Request" --> G["Evaluator"]
  G -- "API Call" --> F
  G -- "API Call" --> H["Result-Fetcher"]
  H -- "Downloads Results" --> I["S3 or GCP Cloud Buckets"]
  I -- "Results Stream" --> G
  G -- "Results Stream" --> C
  C -- "API Response" --> B
  B -- "API Response" --> A
\`\`\`

## Styling and classes
### Styling links
It is possible to style links. For instance, you might want to style a link that is going backwards in the flow. As links have no ids in the same way as nodes, some other way of deciding what style the links should be attached to is required. Instead of ids, the order number of when the link was defined in the graph is used, or use default to apply to all links. In the example below the style defined in the linkStyle statement will belong to the fourth link in the graph:
\`\`\`
linkStyle 3 stroke:#ff3,stroke-width:4px,color:red;
\`\`\`
`,
    "timeline": `
Examples:
User asks: "Generate a timeline visualisation illustrating the inception dates of major social media platforms such as LinkedIn, Facebook, Google, YouTube, and Twitter"
\`\`\`
timeline
  title Inception Dates of Major Social Media Platforms
  2002 : LinkedIn
  2004 : Facebook
  : Google
  2005 : Youtube
  2006 : Twitter
\`\`\`

User asks: "Show me a timeline of Industrial Revolution"
\`\`\`
timeline
  title Timeline of Industrial Revolution
  section 17th-20th century
    Industry 1.0 : Machinery, Water power, Steam power
    Industry 2.0 : Electricity, Internal combustion engine, Mass production
    Industry 3.0 : Electronics, Computers, Automation
  section 21st century
    Industry 4.0 : Internet, Robotics, Internet of Things
    Industry 5.0 : Artificial intelligence, Big data,3D printing
\`\`\`

Description: You can group time periods in sections/ages. This is done by adding a line with the keyword section followed by the section name. All subsequent time periods will be placed in this section until a new section is defined. If no section is defined, all time periods will be placed in the default section.
    `,
    "mindmap": `
Rules when using mindmap diagrams in mermaid syntax:
- Mermaid mindmaps can show nodes using different shapes. When specifying a shape for a node the syntax is similar to flowchart nodes, with an id followed by the shape definition and with the text within the shape delimiters. Where possible try to keep the same shapes as for flowcharts, even though they are not all supported from the start.

- Mindmap can show the following shapes:
\`\`\`
mindmap
    id[I am a square]
    id(I am a rounded square)
    id((I am a circle))
    id))I am a bang((
    id)I am a cloud(
    id{{I am a hexagon}}
    I am the default shape
\`\`\` 

- The "Markdown Strings" feature enhances mind maps by offering a more versatile string type, which supports text formatting options such as bold and italics, and automatically wraps text within labels.
\`\`\`
mindmap
    id1["\`**Root** with
a second line
Unicode works too: 🤓\`"]
      id2["\`The dog in **the** hog... a *very long text* that wraps to a new line\`"]
      id3[Regular labels still works]
\`\`\` 

- Formatting: For bold text, use double asterisks ** before and after the text. For italics, use single asterisks * before and after the text. With traditional strings, you needed to add tags for text to wrap in nodes. However, markdown strings automatically wrap text when it becomes too long and allows you to start a new line by simply using a newline character instead of a tag.
 
Examples:
User asks: "Show me a mindmap about a mindmap"
\`\`\`
mindmap
  root((mindmap))
    Origins
      Long history
      Popularisation
        British popular psychology author Tony Buzan
    Research
      On effectiveness and features
      On Automatic creation
        Uses
            Creative techniques
            Strategic planning
            Argument mapping
    Tools
      Pen and paper
      Mermaid
\`\`\`
`,
    "state": `
Important rules when creating the state diagram in mermaid syntax:
- When making a choice between two or more paths prefer using <<choice>> than a node called Check

Examples:

Simple sample
\`\`\`
stateDiagram-v2
    [*] --> Still
    Still --> [*]

    Still --> Moving
    Moving --> Still
    Moving --> Crash
    Crash --> [*]
\`\`\`

Choice
Sometimes you need to model a choice between two or more paths, you can do so using <<choice>>.
\`\`\`
stateDiagram-v2
    state if_state <<choice>>
    [*] --> IsPositive
    IsPositive --> if_state
    if_state --> False: if n < 0
    if_state --> True : if n >= 0
\`\`\`    
`,
    "user-journey": `
Examples:
\`\`\`
journey
    title My working day
    section Go to work
      Make tea: 5: Me
      Go upstairs: 3: Me
      Do work: 1: Me, Cat
    section Go home
      Go downstairs: 5: Me
      Sit down: 5: Me
\`\`\`
    `,
    "requirement": `
Syntax for requirement diagram in mermaid syntax:
- There are three types of components to a requirement diagram: requirement, element, and relationship.
- The grammar for defining each is defined below. Words denoted in angle brackets, such as <word>, are enumerated keywords that have options elaborated in a table. user_defined_... is use in any place where user input is expected.
- An important note on user text: all input can be surrounded in quotes or not. For example, both Id: "here is an example" and Id: here is an example are both valid. However, users must be careful with unquoted input. The parser will fail if another keyword is detected.

Requirement:
A requirement definition contains a requirement type, name, id, text, risk, and verification method. The syntax follows:
\`\`\`
<type> user_defined_name {
    id: user_defined_id
    text: user_defined text
    risk: <risk>
    verifymethod: <method>
}
\`\`\`

Type, risk, and method are enumerations defined in SysML:
Keyword | Options
Type | requirement, functionalRequirement, interfaceRequirement, performanceRequirement, physicalRequirement,
designConstraint
Risk | Low, Medium, High
VerificationMethod | Analysis, Inspection, Test, Demonstration

Element:
- An element definition contains an element name, type, and document reference. These three are all user defined. The element feature is intended to be lightweight but allow requirements to be connected to portions of other documents.
\`\`\`
element user_defined_name {
    type: user_defined_type
    docref: user_defined_ref
}
\`\`\`

Relationship:
- Relationships are comprised of a source node, destination node, and relationship type.
- Each follows the definition format of "{name of source} - <type> -> {name of destination}" or "{name of destination} <- <type> - {name of source}"
"name of source" and "name of destination" should be names of requirement or element nodes defined elsewhere.
- A relationship type can be one of contains, copies, derives, satisfies, verifies, refines, or traces.
- Each relationship is labeled in the diagram.
        

Examples:
\`\`\`
requirementDiagram
    requirement test_req {
    id: 1
    text: the test text.
    risk: high
    verifymethod: test
    }

    element test_entity {
    type: simulation
    }

    test_entity - satisfies -> test_req
\`\`\`
    `,
    gitgraph: `
Examples:

\`\`\
gitGraph
   commit
   commit
   branch develop
   checkout develop
   commit
   commit
   checkout main
   merge develop
   commit
   commit
\`\`\

Using custom commit id, also called commit messages:
\`\`\
gitGraph
   commit id: "Alpha"
   commit id: "Beta"
   commit id: "Gamma"
\`\`\
    `
  },
  "plantuml": {
    "use-case": `
Important rules when creating the use case diagram in plantuml syntax:
- Do not show underscores as spaces between the words, use a space instead. For example use "Online Shopping Website" instead of "Online_Shopping_Website"
- When connecting use cases with actors use the undirected edge like "e -- UC1". Don't connect an use case with another use case, avoid using "UC1 -- UC2".

Tips when using the use case diagram in plantuml syntax:
- Prefer using "left to right direction" to make the diagram more readable, it makes the diagram separate into three columns. The left column must contain actors like clients or customers who purchase goods or services. The central column should contain the use cases. The right column must contain actors that make the organization work like employees, managers or systems. To make the actors in the left or the right side of the three columns, in the following example, the employee "e" is in the left column (e -- UC4) but the manager "b" and the payroll system "ps" are in the right column(UC1 -- ps, UC3 -- b):
\`\`\`
@startuml
  left to right direction
  rectangle "Payroll Processing" { 
    usecase "Calculate Pay" as UC1
    usecase "Issue Paycheck" as UC2
    usecase "Deposit Paycheck" as UC3
    usecase "Receive Paycheck" as UC4
  }
  actor "Employee" as e
  actor "Payroll System" as ps <<system>>
  actor "Manager" as b
  UC1 -- ps 
  UC2 -- ps  
  UC3 -- b
  e -- UC4
@enduml
\`\`\`

Examples:
User asks: "Show me how a food critic can interact with a restaurant"
\`\`\`
@startuml
left to right direction
  actor "Food Critic" as fc
  rectangle Restaurant {
    usecase "Eat Food" as UC1
    usecase "Pay for Food" as UC2
    usecase "Write Review" as UC3
  }
  fc -- UC1
  fc -- UC2
  fc -- UC3
@enduml
\`\`\`
`,
    json: `
Examples:

Simple example:
\`\`\
@startjson
{
   "fruit":"Apple",
   "size":"Large",
   "color": ["Red", "Green"]
}
@endjson
\`\`\

Complex example:
\`\`\
@startjson
{
  "firstName": "John",
  "lastName": "Smith",
  "isAlive": true,
  "age": 27,
  "address": {
    "streetAddress": "21 2nd Street",
    "city": "New York",
    "state": "NY",
    "postalCode": "10021-3100"
  },
  "phoneNumbers": [
    {
      "type": "home",
      "number": "212 555-1234"
    },
    {
      "type": "office",
      "number": "646 555-4567"
    }
  ],
  "children": [],
  "spouse": null
}
@endjson
\`\`\
`,
    yaml: `
When creating a salt wireframe always start with @startyaml and ends with @endyaml
    
Simple example:
\`\`\
@startyaml
fruit: Apple
size: Large
color: 
  - Red
  - Green
@endyaml
\`\`\

Complex example:
\`\`\
@startyaml
doe: "a deer, a female deer"
ray: "a drop of golden sun"
pi: 3.14159
xmas: true
french-hens: 3
calling-birds: 
  - huey
  - dewey
  - louie
  - fred
xmas-fifth-day: 
  calling-birds: four
  french-hens: 3
  golden-rings: 5
  partridges: 
    count: 1
    location: "a pear tree"
  turtle-doves: two
@endyaml
\`\`\
    `,
    "salt-wireframe": `
When creating a salt wireframe always start with @startsalt and ends with @endsalt
    
# Basic widgets
A window must start and end with brackets. You can then define:
* Button using [ and ].
* Radio button using ( and ).
* Checkbox using [ and ].
* User text area using ".
* Droplist using ^.

\`\`\
@startsalt
{
  Just plain text
  [This is my button]
  ()  Unchecked radio
  (X) Checked radio
  []  Unchecked box
  [X] Checked box
  "Enter text here   "
  ^This is a droplist^
}
@endsalt

# Text area
Here is an attempt to create a text area:

\`\`\
@startsalt
{+
   This is a long
   text in a textarea
   .
   "                         "
}
@endsalt
\`\`\

Note:
* the dot (.) to fill up vertical space;
* the last line of space ("  ") to make the area wider.

Then you can add vertical scroll bar:
\`\`\
@startsalt
{SI
   This is a long
   text in a textarea
   .
   "                         "
}
@endsalt
\`\`\

Then you can add horizontal scroll bar:
\`\`\
@startsalt
{S-
   This is a long
   text in a textarea
   .
   "                         "
}
@endsalt
\`\`\

# Using grid [| and #, !, -, +]
A table is automatically created when you use an opening bracket {. And you have to use | to separate columns.
For example:
\`\`\
@startsalt
{
  Login    | "MyName   "
  Password | "****     "
  [Cancel] | [  OK   ]
}
@endsalt
\`\`\

Just after the opening bracket, you can use a character to define if you want to draw lines or columns of the grid :
Symbol | Result
# | To display all vertical and horizontal lines
! | To display all vertical lines
- | To display all horizontal lines
+ | To display external lines

# Group box [^]
\`\`\
@startsalt
{^"My group box"
  Login    | "MyName   "
  Password | "****     "
  [Cancel] | [  OK   ]
}
@endsalt
\`\`\

# Tree widget [T]
To have a Tree, you have to start with {T and to use + to denote hierarchy.

\`\`\
@startsalt
{
{T
+ World
++ America
+++ Canada
+++ USA
++++ New York
++++ Boston
+++ Mexico
++ Europe
+++ Italy
+++ Germany
++++ Berlin
++ Africa
}
}
@endsalt
\`\`\

# Tree table [T]
You can combine trees with tables.
\`\`\
@startsalt
{
{T
+Region        | Population    | Age
+ World        | 7.13 billion  | 30
++ America     | 964 million   | 30
+++ Canada     | 35 million    | 30
+++ USA        | 319 million   | 30
++++ NYC       | 8 million     | 30
++++ Boston    | 617 thousand  | 30
+++ Mexico     | 117 million   | 30
++ Europe      | 601 million   | 30
+++ Italy      | 61 million    | 30
+++ Germany    | 82 million    | 30
++++ Berlin    | 3 million     | 30
++ Africa      | 1 billion     | 30
}
}
@endsalt
\`\`\

    `
  },
  "d2": {
    "graph": d2GraphGuidelines,
    "sequence": `
# D2 syntax basics
${d2GraphGuidelines}

# Sequence diagrams
Sequence diagrams are created by setting "shape: sequence_diagram" on an object.

Examples:
\`\`\`
shape: sequence_diagram
alice -> bob: What does it mean to be well-adjusted?
bob -> alice: The ability to play bridge or golf as if they were games.
\`\`\`

## Rules
Unlike other tools, there is no special syntax to learn for sequence diagrams. The rules are also almost exactly the same as everywhere else in D2, with two notable differences.

## Scoping
Children of sequence diagrams share the same scope throughout the sequence diagram.
\`\`\`
Office chatter: {
  shape: sequence_diagram
  alice: Alice
  bob: Bobby
  awkward small talk: {
    alice -> bob: uhm, hi
    bob -> alice: oh, hello
    icebreaker attempt: {
      alice -> bob: what did you have for lunch?
    }
    unfortunate outcome: {
      bob -> alice: that's personal
    }
  }
}
\`\`\`
Outside of a sequence diagram, there would be multiple instances of alice and bob, since they have different container scopes. But when nested under shape: sequence_diagram, they refer to the same alice and bob.

## Ordering
Elsewhere in D2, there is no notion of order. If you define a connection after another, there is no guarantee is will visually appear after. However, in sequence diagrams, order matters. The order in which you define everything is the order they will appear.

This includes actors. You don't have to explicitly define actors (except when they first appear in a group), but if you want to define a specific order, you should.

\`\`\`
shape: sequence_diagram
# Remember that semicolons allow multiple objects to be defined in one line
# Actors will appear from left-to-right as a, b, c, d...
a; b; c; d
# ... even if the connections are in a different order
c -> d
d -> a
b -> d
\`\`\`

## Sequence diagrams are D2 objects
Like every other object in D2, they can be contained, connected, relabeled, re-styled, and treated like any other object.
\`\`\`
direction: right
Before and after becoming friends: {
  2007: Office chatter in 2007 {
    shape: sequence_diagram
    alice: Alice
    bob: Bobby
    awkward small talk: {
      alice -> bob: uhm, hi
      bob -> alice: oh, hello
      icebreaker attempt: {
        alice -> bob: what did you have for lunch?
      }
      unfortunate outcome: {
        bob -> alice: that's personal
      }
    }
  }

  2012: Office chatter in 2012 {
    shape: sequence_diagram
    alice: Alice
    bob: Bobby
    alice -> bob: Want to play with ChatGPT?
    bob -> alice: Yes!
    bob -> alice.play: Write a play...
    alice.play -> bob.play: about 2 friends...
    bob.play -> alice.play: who find love...
    alice.play -> bob.play: in a sequence diagram
  }

  2007 -> 2012: Five\\nyears\\nlater
}
\`\`\`

## Spans
Spans convey a beginning and end to an interaction within a sequence diagram.
A span in D2 is also known elsewhere as a "lifespan", "activation box", and "activation bar".
You can specify a span by connecting a nested object on an actor.

\`\`\`
shape: sequence_diagram
alice.t1 -> bob
alice.t2 -> bob.a
alice.t2.a -> bob.a
alice.t2.a <- bob.a
alice.t2 <- bob.a
\`\`\`

## Notes
Notes are declared by defining a nested object on an actor with no connections going to it.
\`\`\`
shape: sequence_diagram
alice -> bob
bob."In the eyes of my dog, I'm a man."
# Notes can go into groups, too
important insight: {
  bob."Cold hands, no gloves."
}
bob -> alice: Chocolate chip.
\`\`\`

## Self-messages
Self-referential messages can be declared from an actor to the themselves.
\`\`\`
shape: sequence_diagram
son -> father: Can I borrow your car?
friend -> father: Never lend your car to anyone to whom you have given birth.
father -> father: internal debate ensues
\`\`\`

## Customization
You can style shapes and connections like any other. Here we make some messages dashed and set the shape on an actor.
\`\`\`
shape: sequence_diagram
scorer: { shape: person }
scorer.t -> itemResponse.t: getItem()
scorer.t <- itemResponse.t: item {
    style.stroke-dash: 5
}

scorer.t -> item.t1: getRubric()
scorer.t <- item.t1: rubric {
    style.stroke-dash: 5
}

scorer.t -> essayRubric.t: applyTo(essayResp)
itemResponse -> essayRubric.t.c
essayRubric.t.c -> concept.t: match(essayResponse)
scorer <- essayRubric.t: score {
    style.stroke-dash: 5
}

scorer.t -> itemOutcome.t1: new
scorer.t -> item.t2: getNormalMinimum()
scorer.t -> item.t3: getNormalMaximum()

scorer.t -> itemOutcome.t2: setScore(score)
scorer.t -> itemOutcome.t3: setFeedback(missingConcepts)
\`\`\`

Lifeline edges (those lines going from top-down) inherit the actor's stroke and stroke-dash styles.
\`\`\`
shape: sequence_diagram
alice -> bob: What does it mean\\nto be well-adjusted?
bob -> alice: The ability to play bridge or\\ngolf as if they were games.

alice.style: {
  stroke: red
  stroke-dash: 0
}
\`\`\`

`,
    "class": `
# D2 syntax basics
${d2GraphGuidelines}

# Class diagram
D2 fully supports UML Class diagrams. Here's a minimal example:
\`\`\`
MyClass: {
  shape: class

  field: "[]string"
  method(a uint64): (x, y int)
}
\`\`\`

Each key of a "class" shape defines either a field or a method.
The value of a field key is its type.
Any key that contains "(" is a method, whose value is the return type.
A method key without a value has a return type of void.

## Visibilities
You can also use UML-style prefixes to indicate field/method visibility.

visiblity prefix | meaning
none | public
+ | public
- | private
# | protected

Here's an example with differing visibilities and more complex types:
\`\`\`
D2 Parser: {
  shape: class

  # Default visibility is + so no need to specify.
  +reader: io.RuneReader
  readerPos: d2ast.Position

  # Private field.
  -lookahead: "[]rune"

  # Protected field.
  # We have to escape the # to prevent the line from being parsed as a comment.
  \\#lookaheadPos: d2ast.Position

  +peek(): (r rune, eof bool)
  rewind()
  commit()

  \\#peekn(n int): (s string, eof bool)
}

"github.com/terrastruct/d2parser.git" -> D2 Parser
\`\`\`


    `,
    "entity-relationship": `
# D2 syntax basics
${d2GraphGuidelines}

# SQL Tables
You can easily diagram entity-relationship diagrams (ERDs) in D2 by using the "sql_table" shape. Here's a minimal example:
\`\`\`
my_table: {
  shape: sql_table
  # This is defined using the shorthand syntax for labels discussed in the containers section.
  # But here it's for the type of a constraint.
  # The id field becomes a map that looks like {type: int; constraint: primary_key}
  id: int {constraint: primary_key}
  last_updated: timestamp with time zone
}
\`\`\`

Each key of a SQL Table shape defines a row. The primary value (the thing after the colon) of each row defines its type.
The constraint value of each row defines its SQL constraint. D2 will recognize and shorten:

constraint | short
primary_key | PK
foreign_key | FK
unique | UNQ

But you can set any constraint you'd like. It just won't be shortened if unrecognized.

## Foreign Keys
Here's an example of how you'd define a foreign key connection between two tables:
\`\`\`
objects: {
  shape: sql_table
  id: int {constraint: primary_key}
  disk: int {constraint: foreign_key}

  json: jsonb  {constraint: unique}
  last_updated: timestamp with time zone
}

disks: {
  shape: sql_table
  id: int {constraint: primary_key}
}

objects.disk -> disks.id
\`\`\`

If you hover over the primary key or foreign key with your cursor, you'll notice that the corresponding key is highlighted.

## Example
Like all other shapes, you can nest sql_tables into containers and define edges to them from other shapes. Here's an example:

\`\`\`
cloud: {
  disks: {
    shape: sql_table
    id: int {constraint: primary_key}
  }
  blocks: {
    shape: sql_table
    id: int {constraint: primary_key}
    disk: int {constraint: foreign_key}
    blob: blob
  }
  blocks.disk -> disks.id

  AWS S3 Vancouver -> disks
}
\`\`\`
`,
    "grid": `
# Grid Diagrams
Grid diagrams let you display objects in a structured grid.

Two keywords do all the magic:

* grid-rows
* grid-columns

Setting just grid-rows:
\`\`\`
grid-rows: 3
Executive
Legislative
Judicial
\`\`\`

Setting just grid-columns:
\`\`\`
grid-columns: 3
Executive
Legislative
Judicial
\`\`\`

Setting both grid-rows and grid-columns:
\`\`\`
grid-rows: 2
grid-columns: 2
Executive
Legislative
Judicial
\`\`\`

## Width and height
To create specific constructions, use width and/or height.

\`\`\`
grid-rows: 2
Executive
Legislative
Judicial
The American Government.width: 400
\`\`\`

Notice how objects are evenly distributed within each row.

## Cells expand to fill
When you define only one of row or column, objects will expand.

\`\`\`
grid-rows: 3
Executive
Legislative
Judicial
The American Government.width: 400
Voters
Non-voters
\`\`\`

Notice how Voters and Non-voters fill the space.

## Dominant direction
When you apply both row and column, the first appearance is the dominant direction. The dominant direction is the order in which cells are filled.

For example:
\`\`\`
grid-rows: 4
grid-columns: 2
# bunch of shapes
\`\`\`

But if it were reversed:
\`\`\`
grid-columns: 2
grid-rows: 4
# bunch of shapes
\`\`\`

## Gap size
You can control the gap size of the grid with 3 keywords:
* vertical-gap
* horizontal-gap
* grid-gap

Setting "grid-gap" is equivalent to setting both "vertical-gap" and "horizontal-gap".
"vertical-gap" and "horizontal-g"ap can override grid-gap.
"grid-gap: 0" in particular can create some interesting constructions:

Like this table of data:
\`\`\`
# Specified so that objects are written in row-dominant order
grid-rows: 2
grid-columns: 4
grid-gap: 0

classes: {
  header: {
    style.underline: true
  }
}

Element.class: header
Atomic Number.class: header
Atomic Mass.class: header
Melting Point.class: header

Hydrogen
1
"1.008"
"-259.16"

Carbon
6
"12.011"
3500

Oxygen
8
"15.999"
"-218.79"
\`\`\`
`
  },
  "nomnoml": {
    "graph": nomnomlGraphGuidelines,
    "activity": `
# Nomnoml syntax basics
${nomnomlGraphGuidelines}

# Activity diagram
- The activity diagram should have a start point "<start>" and an end point "<end>" 
- Prefer using "<choice>" classifier type over a simple node when representing a decision

Example:
\`\`\`
[<start>start] -> [<state>plunder] 
[<state>plunder] -> [<choice>more loot]
[<choice>more loot] -> [start]
[more loot] no ->[<end>end]
\`\`\`
    `,
    "class": `
# Nomnoml syntax basics
${nomnomlGraphGuidelines}

# Class diagram
- The class diagram consist of classes following the pattern described in the example
- Avoid using <table> because is not an entity relationship diagram 
- Avoid association type "-"

Example:
\`\`\`
[ClassName|Attribute: Type;Attribute: Type|Method(Param: Type, Param: Type): ReturnType] -> *[rum|tastiness: Int|swig()]
\`\`\`
    `,
    "entity-relationship": `
# Nomnoml syntax basics
${nomnomlGraphGuidelines}

# Entity Relationship diagram
Example:
\`\`\`
#.relationship: visual=rhomb 
#.attribute: visual=roundrect 
#.entity:  direction=right

[<attribute>student_id] - [<entity>student] 
[<attribute>student_name] - [<entity>student]
[<attribute>student_age] - [<entity>student]

[<entity>student] -> [<relationship>study]
[<relationship>study] -> [<entity>course]

[<entity>course] - [<attribute>course_id] 
[<entity>course] - [<attribute>course_name]
\`\`\`
`
  },
  "graphviz": {
    "entity-relationship": `
- Prefer that every entity should have at least 2 attributes
- Entities must not share the same attributes 
- Prefer prepend "\\n\\n" to the label to give some space between the diagram title and the rest of the diagram

Example
\`\`\`
graph ER {
  fontname="Helvetica,Arial,sans-serif"
  node [fontname="Helvetica,Arial,sans-serif"]
  edge [fontname="Helvetica,Arial,sans-serif"]
  layout=neato
  node [shape=box]; course; student;
  node [shape=ellipse]; name; code; grade; number; id;
  node [shape=diamond,style=filled,color=lightgrey]; "S-C";

  name -- course;
  code -- course;
  course -- "S-C" [label="n",len=1.00];
  student -- grade;
  student -- id;
  student -- number;
  student -- "S-C" [label="m",len=1.00];

  label = "\\n\\nEntity Relation Diagram";
  fontsize=20;
}
\`\`\`
    
Same example as above but adding the attribute institute and the student has the name attribute
\`\`\`
graph ER {
  fontname="Helvetica,Arial,sans-serif"
  node [fontname="Helvetica,Arial,sans-serif"]
  edge [fontname="Helvetica,Arial,sans-serif"]
  layout=neato
  node [shape=box]; course; institute; student;
  node [shape=ellipse]; {node [label="name"] name0; name1; name2;}
    code; grade; number; id;
  node [shape=diamond,style=filled,color=lightgrey]; "C-I"; "S-C"; "S-I";

  name0 -- course;
  code -- course;
  course -- "C-I" [label="n",len=1.00];
  "C-I" -- institute [label="1",len=1.00];
  institute -- name1;
  institute -- "S-I" [label="1",len=1.00];
  "S-I" -- student [label="n",len=1.00];
  student -- id;
  student -- grade;
  student -- name2;
  student -- number;
  student -- "S-C" [label="m",len=1.00];
  "S-C" -- course [label="n",len=1.00];

  label = "\\n\\nEntity Relation Diagram";
  fontsize=20;
}
\`\`\`
`
  },
  actdiag: {
    activity: `
Example:
\`\`\`
{
   A -> B -> C -> D;

  lane foo {
    A; B;
  }
  lane bar {
    C; D;
  }
}  
\`\`\`
  
Example:
\`\`\`
actdiag {
  write -> convert -> image

  lane user {
     label = "User"
     write [label = "Writing reST"];
     image [label = "Get diagram IMAGE"];
  }
  lane actdiag {
     convert [label = "Convert reST to Image"];
  }
}
\`\`\
`
  },
  blockdiag: {
    block: `
Simple diagram
\`\`\`
blockdiag {
   A -> B -> C -> D;
   A -> E -> F -> G;
}
\`\`\`
`
  },
  nwdiag: {
    network: `
Simple diagram:
\`\`\`
nwdiag {
  network dmz {
      address = "210.x.x.x/24"

      web01 [address = "210.x.x.1"];
      web02 [address = "210.x.x.2"];
  }
  network internal {
      address = "172.x.x.x/24";

      web01 [address = "172.x.x.1"];
      web02 [address = "172.x.x.2"];
      db01;
      db02;
  }
}
\`\`\`
    `,
  },
  rackdiag: {
    rack: `
Simple diagram:
\`\`\`
rackdiag {
  // define height of rack
  16U;

  // define rack items
  1: UPS [2U];
  3: DB Server
  4: Web Server
  5: Web Server
  6: Web Server
  7: Load Balancer
  8: L3 Switch
}
\`\`\`
`
  },
  erd: {
    "entity-relationship": `
# Basics
- Entities are declared in '[' ... ']'. All attributes after the entity header up until the end of the file (or the next entity declaration) correspond to this entity.
- Each relationship must be between exactly two entities, which need not be distinct. Each entity in the relationship has exactly one of four possible cardinalities:
Cardinality |  Syntax
0 or 1      |  ?
exactly 1   |  1
0 or more   |  *
1 or more   |  +
    
Example:
Let's try making an ER diagram from a small example:
\`\`\`
[Person]
*name
height
weight
+birth_location_id

[Location]
*id
city
state
country

Person *--1 Location
\`\`\`

Example 2:
\`\`\`
[Person]
*name
height
weight
\`birth date\`
+birth_place_id

[\`Birth Place\`]
*id
\`birth city\`
'birth state'
"birth country"

Person *--1 \`Birth Place\`
\`\`\`

# Fonts, colors, labels, ...
The er format also has limited support for customizing the appearance of your ER diagram. For example, the following will show the entity with a background color of #ececfc and a font size of 20:
\`\`\`
[Person] {bgcolor: "#ececfc", size: "20"}
name
height
weight
\`\`\`

Alternatively, you can specify the background color of every entity with a special directive at the top of the file:
\`\`\`
entity {bgcolor: "#ececfc", size: "20"}

[Person]
name
height
weight

[\`Birth Place\`]
place
\`\`\`

There are three other directives: "title", "header" and "relationship". The "title" directive allows one to specify a title for the graph and provide options for formatting it. The "header" directive allows one to customize the formatting of every entity header. And similarly for "relationship". Note that global options are overwritten by local options.

Note that directives **must come before anything else** in an ER file.

Here's an complete example:
\`\`\`
title {label: "nfldb Entity-Relationship diagram (condensed)", size: "20"}

# Entities

[player] {bgcolor: "#d0e0d0"}
  *player_id {label: "varchar, not null"}
  full_name {label: "varchar, null"}
  team {label: "varchar, not null"}
  position {label: "player_pos, not null"}
  status {label: "player_status, not null"}

[team] {bgcolor: "#d0e0d0"}
  *team_id {label: "varchar, not null"}
  city {label: "varchar, not null"}
  name {label: "varchar, not null"}

[game] {bgcolor: "#ececfc"}
  *gsis_id {label: "gameid, not null"}
  start_time {label: "utctime, not null"}
  week {label: "usmallint, not null"}
  season_year {label: "usmallint, not null"}
  season_type {label: "season_phase, not null"}
  finished {label: "boolean, not null"}
  home_team {label: "varchar, not null"}
  home_score {label: "usmallint, not null"}
  away_team {label: "varchar, not null"}
  away_score {label: "usmallint, not null"}

[drive] {bgcolor: "#ececfc"}
  *+gsis_id {label: "gameid, not null"}
  *drive_id {label: "usmallint, not null"}
  start_field {label: "field_pos, null"}
  start_time {label: "game_time, not null"}
  end_field {label: "field_pos, null"}
  end_time {label: "game_time, not null"}
  pos_team {label: "varchar, not null"}
  pos_time {label: "pos_period, null"}

[play] {bgcolor: "#ececfc"}
  *+gsis_id {label: "gameid, not null"}
  *+drive_id {label: "usmallint, not null"}
  *play_id {label: "usmallint, not null"}
  time {label: "game_time, not null"}
  pos_team {label: "varchar, not null"}
  yardline {label: "field_pos, null"}
  down {label: "smallint, null"}
  yards_to_go {label: "smallint, null"}

[play_player] {bgcolor: "#ececfc"}
  *+gsis_id {label: "gameid, not null"}
  *+drive_id {label: "usmallint, not null"}
  *+play_id {label: "usmallint, not null"}
  *+player_id {label: "varchar, not null"}
  team {label: "varchar, not null"}

[meta] {bgcolor: "#fcecec"}
  version {label: "smallint, null"}
  season_type {label: "season_phase, null"}
  season_year {label: "usmallint, null"}
  week {label: "usmallint, null"}

# Relationships

player      *--1 team
game        *--1 team {label: "home"}
game        *--1 team {label: "away"}
drive       *--1 team
play        *--1 team
play_player *--1 team

game        1--* drive
game        1--* play
game        1--* play_player

drive       1--* play
drive       1--* play_player

play        1--* play_player

player      1--* play_player
\`\`\`\
`
  },
  "vegalite": {
    "bar-chart": `
Example:
\`\`\`
{
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "description": "A simple bar chart with embedded data.",
  "data": {
    "values": [
      {"a": "A", "b": 28},
      {"a": "B", "b": 55},
      {"a": "C", "b": 43},
      {"a": "D", "b": 91},
      {"a": "E", "b": 81},
      {"a": "F", "b": 53},
      {"a": "G", "b": 19},
      {"a": "H", "b": 87},
      {"a": "I", "b": 52}
    ]
  },
  "mark": "bar",
  "encoding": {
    "x": {"field": "a", "type": "nominal", "axis": {"labelAngle": 0}},
    "y": {"field": "b", "type": "quantitative"}
  },
  "width": { "step": 50 }
}
\`\`\`
- About the last example example, "a" and "b" are x-axis label and y-axis label. You should use more descriptive names for these labels instead of just "a" or "b".

Example using groups:
\`\`\`
{
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "data": {
    "values": [
      {"category": "A", "group": "x", "value": 0.1},
      {"category": "A", "group": "y", "value": 0.6},
      {"category": "A", "group": "z", "value": 0.9},
      {"category": "B", "group": "x", "value": 0.7},
      {"category": "B", "group": "y", "value": 0.2},
      {"category": "B", "group": "z", "value": 1.1},
      {"category": "C", "group": "x", "value": 0.6},
      {"category": "C", "group": "y", "value": 0.1},
      {"category": "C", "group": "z", "value": 0.2}
    ]
  },
  "width": { "step": 50 },
  "mark": "bar",
  "encoding": {
    "x": {"field": "category"},
    "y": {
      "field": "value",
      "type": "quantitative",
      "axis": {"title": "population", "grid": false}
    },
    "xOffset": {"field": "group"},
    "color": {"field": "group"}
  }
}
\`\`\`
`,
    "histogram": `
Example:
\`\`\`
{
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "data": {
    "values": [
      {"bin_start": 8, "bin_end": 10, "count": 7},
      {"bin_start": 10, "bin_end": 12, "count": 29},
      {"bin_start": 12, "bin_end": 14, "count": 71},
      {"bin_start": 14, "bin_end": 16, "count": 127},
      {"bin_start": 16, "bin_end": 18, "count": 94},
      {"bin_start": 18, "bin_end": 20, "count": 54},
      {"bin_start": 20, "bin_end": 22, "count": 17},
      {"bin_start": 22, "bin_end": 24, "count": 5}
    ]
  },
  "mark": "bar",
  "encoding": {
    "x": {
      "field": "bin_start",
      "bin": {"binned": true, "step": 2}
    },
    "x2": {"field": "bin_end"},
    "y": {
      "field": "count",
      "type": "quantitative"
    }
  }
}
\`\`\`
    `,
    "line-chart": `
Example:
\`\`\`
{
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "description": "Line chart with a dashed part created by drawing multiple connecting lines. Note that the data source contains the data point at (E, 81) twice.",
  "data": {
    "values": [
      {"a": "A", "b": 28, "predicted": false},
      {"a": "B", "b": 55, "predicted": false},
      {"a": "D", "b": 91, "predicted": false},
      {"a": "E", "b": 81, "predicted": false},
      {"a": "E", "b": 81, "predicted": true},
      {"a": "G", "b": 19, "predicted": true},
      {"a": "H", "b": 87, "predicted": true}
    ]
  },
  "mark": "line",
  "encoding": {
    "x": {"field": "a", "type": "ordinal"},
    "y": {"field": "b", "type": "quantitative"},
    "strokeDash": {"field": "predicted", "type": "nominal"}
  }
}
\`\`\`
    `
  }
}
