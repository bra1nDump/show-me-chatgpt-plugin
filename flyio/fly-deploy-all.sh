# Now create all these apps if not present already 
# TODO: Move to kubernetes: https://docs.kroki.io/kroki/setup/use-kubernetes/
# TODO: Add health checks and restart container if needed
flyctl apps create kroki
flyctl apps create kroki-blockdiag
flyctl apps create kroki-mermaid
flyctl apps create kroki-bpmn
flyctl apps create kroki-excalidraw
flyctl apps create kroki-wireviz

flyctl deploy -c fly-kroki.toml

flyctl deploy -c fly-blockdiag.toml
flyctl deploy -c fly-mermaid.toml
flyctl deploy -c fly-bpmn.toml
flyctl deploy -c fly-excalidraw.toml
flyctl deploy -c fly-wireviz.toml
