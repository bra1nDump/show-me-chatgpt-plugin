How to find more prompts:
enter ```mermaid in github search
https://github.com/search?q=%60%60%60mermaid&type=code

## Example prompts

Diagram for architecture of a vscode extension

## Good response

```mermaid
graph LR
    User-->FileOperations{File Operations}
    User-->CodeEditor{Code Editor}
    FileOperations-->|Manipulation of Files| FileSystem
    FileSystem-->|Write/Read|Disk
    FileSystem-->|Compress/Decompress|ZipLib
    FileSystem-->|Read|INIParser
    CodeEditor-->|Create/Display/Edit| Webview
    CodeEditor-->|Language/Code Analysis| VSCodeAPI
    VSCodeAPI-->ValidationEngine
    Webview-->|Render UI| HTMLCSS
    ValidationEngine-->ErrorDecoration
    ValidationEngine-->TextDocument
```

## More detailed, so so

```mermaid
flowchart TD
    subgraph Extension
        A[Extension] --> B[Extension Folder]
        B --> C[Package.json]
        B --> D[Source Files]
        B --> E[Node Modules]
        B --> F[Test Files]
        subgraph Activate/Deactivate
            G[Activate] --> H[Register Commands]
            G --> I[Register Event Handlers]
            G --> J[Create Editor UI]

            K[Deactivate] --> L[Disposes all components]
        end
        subgraph Create Editor UI
            J --> M[Create editors for files]
            J --> N[Add UI components and Event Handlers to editors]
        end
        subgraph Commands and Event Handlers
            H --> O[Execute command actions]
            I --> O

            O --> P[Access/Modify Editor and Workspace State]
            O --> Q[Access/Modify Configuration Settings]
        end
    end
    subgraph VSCode
        R[APIs] --> M
        R --> N
        R --> H
        R --> I
        R --> K
        R --> P
        R --> Q
    end
```

Diagram for architecture of a vscode open source project. How is it achitecturally structured?

## Good

```mermaid
graph LR
    A[VSCode architecture] --> B[Electron]
    A --> C[Node.js]
    A --> D[VSCode extensions API]
    A --> E[VSCode core]
    E --> F[Editor]
    E --> G[Extensions]
    E --> H[Workbench]
    E --> I[Languages]
    E --> J[Debugging]
```

## Actual production diagrams found online

```mermaid
flowchart TB
    classDef default text-align:left
    subgraph VisualStudioSubgraph[Visual Studio]
        direction TB
        STLNode("<b>STL</b>
        This repo; provides C++ Standard Library headers, separately
        compiled implementations of most of the iostreams functionality,
        and a few runtime support components like std::exception_ptr.")
        subgraph VCRuntimeSubgraph[VCRuntime]
            direction TB
            VCStartupNode("<b>VCStartup</b>
            Provides compiler support mechanisms that
            live in each binary; such as machinery to
            call constructors and destructors for global
            variables, the entry point, and the /GS cookie.

            Merged into static and import libraries of VCRuntime.")
            VCRuntimeNode("<b>VCRuntime</b>
            Provides compiler support mechanisms that can be
            shared between binaries; code that the compiler calls
            on your behalf, such as the C++ exception handling
            runtime, string.h intrinsics, math intrinsics, and
            declarations for CPU-vendor-specific intrinsics.")
        end
    end
    subgraph WindowsSDKSubgraph[Windows SDK]
        UniversalCRTNode("<b>Universal CRT</b>
        Windows component that provides C library support, such as printf,
        C locales, and some POSIX-like shims for the Windows API, like _stat.")
    end
    STLNode ==> VCRuntimeSubgraph & UniversalCRTNode
    VCStartupNode ==> VCRuntimeNode ==> UniversalCRTNode
```
