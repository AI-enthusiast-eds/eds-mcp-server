# AEM Edge Delivery Services — MCP Server

A **Model Context Protocol** server that supercharges AEM EDS development in VS Code, Cursor, and any MCP-compatible IDE. No API keys needed — your IDE's own LLM uses these tools, resources, and prompts to generate EDS-compliant code.

## What It Does

| Category | Tools | Description |
|----------|-------|-------------|
| **Scaffolding** | `scaffold_block` | Generate complete block files (JS, CSS, README, test.html, sample content) |
| | `scaffold_model` | Generate Universal Editor component model/definition/filter JSON |
| | `scaffold_project` | Step-by-step guide for new EDS projects (standard & repoless) |
| | `generate_block_from_design` | **Multimodal** — turn a text description, design image, and/or Figma URL into an EDS block using Adobe's Content-Driven-Development workflow |
| **Validation** | `validate_block` | Check JS, CSS, JSON model, and content against EDS standards |
| | `check_performance` | Analyze block code for performance issues and budget impact |
| **Guidance** | `explain_dom` | Show how authored content tables transform into DOM |
| | `lookup_block` | Search block patterns and find existing implementations |
| | `search_block_collection` | Search Adobe Block Collection & Block Party via GitHub API |
| | `eds_config` | Generate configuration files (fstab, redirects, headers, etc.) |
| | `eds_scripts_guide` | Guidance for scripts.js, delayed.js, and lifecycle customization |

Plus **4 resources** (coding standards, block guide, cheatsheet, **Adobe EDS skills**) and **3 prompt templates** (new-block, fix-block, **design-to-block**).

### Prompt Parameters

| Prompt | Parameters |
|--------|------------|
| `new-block` | `blockName` (required), `description` (required) |
| `fix-block` | `blockName` (required), `issue` (required) |
| `design-to-block` | `blockName` (required), `text`, `imageRefs`, `figmaUrl` (at least one of the last three) |

### Design → Block workflow

The `generate_block_from_design` tool and the `design-to-block` prompt integrate
Adobe's official [EDS skills](https://github.com/adobe/skills/tree/beta/skills/aem/edge-delivery-services)
(Content-Driven Development, analyze-and-plan, content-modeling, authoring-analysis,
building-blocks, UE component model, testing-blocks, code-review).

Provide any combination of:

- **Text** — natural-language description of what the block should do
- **Image(s)** — local paths or URLs of design screenshots/mockups (the IDE LLM
  analyzes them with vision)
- **Figma URL** — a `figma.com/file/...` or `figma.com/design/...` link, optionally
  with `?node-id=…`. The tool emits a local `curl` recipe to pull node JSON +
  a 2× PNG export; your Figma token stays on your machine.

The tool returns: the CDD workflow outline, a vision-analysis prompt for the IDE
LLM, the Figma-fetch recipe (if applicable), implementation patterns, a baseline
scaffold (JS/CSS/README/test.html/sample-content), the UE component-model
guidance, a testing matrix, and a self-review checklist.

## Quick Start

### Cursor

Open **Settings → Tools & Integrations → MCP Servers → Add** and paste:

```json
{
  "mcpServers": {
    "eds-dev": {
      "command": "npx",
      "args": ["-y", "@anthropic-eds/eds-mcp-server"]
    }
  }
}
```

Or create `.cursor/mcp.json` in your project root with the same config.

### VS Code

Create `.vscode/mcp.json` in your project:

```json
{
  "servers": {
    "eds-dev": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@anthropic-eds/eds-mcp-server"]
    }
  }
}
```

Then use GitHub Copilot Chat in **Agent Mode** (the `@` button) to access the tools.

### Local CLI Validator (New)

This project now includes an EDS block validator/linter CLI.

```bash
npm run build
npm run validate:blocks -- ./blocks
# or directly
node dist/cli.js ./blocks --strict
```

Options:
- `--json` for CI-friendly machine output
- `--strict` to fail on warnings
- `--help` for usage details

### Claude Code

Add to your `~/.claude/mcp.json`:

```json
{
  "mcpServers": {
    "eds-dev": {
      "command": "npx",
      "args": ["-y", "@anthropic-eds/eds-mcp-server"]
    }
  }
}
```

### From Source (Development)

```bash
git clone https://github.com/your-org/eds-mcp-server.git
cd eds-mcp-server
npm install
npm run build

# Test with MCP Inspector
npm run inspect
# Opens browser at http://localhost:6274

# Add to IDE pointing to local build:
# "command": "node",
# "args": ["/path/to/eds-mcp-server/dist/index.js"]
```

## Usage Examples

### Scaffold a new block

Ask your IDE's AI: *"Create a hero block with a background image, heading, and CTA button"*

The LLM will call `scaffold_block` and return all 5 files ready to copy into your project.

### Validate existing code

Ask: *"Validate my cards block"* — paste your JS and CSS. The `validate_block` tool checks for scoping issues, missing exports, reserved class names, performance problems, and more.

### Understand the DOM pipeline

Ask: *"How does a 3-row, 2-column table become DOM in EDS?"*

The `explain_dom` tool shows the exact HTML structure your decorate function receives.

### Set up a new project

Ask: *"Set up a new repoless EDS site with Google Drive and Universal Editor"*

The `scaffold_project` tool returns a complete step-by-step guide.

### Get configuration templates

Ask: *"I need to set up redirects and custom headers"*

The `eds_config` tool returns ready-to-use spreadsheet formats and configuration examples.

### Check performance

Ask: *"Is this block going to hurt my Lighthouse score?"* — paste the code.

The `check_performance` tool estimates budget impact and flags render-blocking patterns.

## Tool Reference

### scaffold_block

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `blockName` | string | ✅ | | Block name in kebab-case |
| `description` | string | | | What the block does |
| `variant` | string | | | Variant name (e.g. "dark") |
| `layout` | `grid\|flex\|stack` | | `stack` | CSS layout strategy |
| `hasMedia` | boolean | | `false` | Has image/video column |
| `interactive` | boolean | | `false` | Needs event handlers |
| `fields` | array | | | Universal Editor field definitions (name, type, label) |

### scaffold_model

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `blockName` | string | ✅ | Block name in kebab-case |
| `title` | string | | Human-readable block title for the editor |
| `group` | string | | Block group/category for editor UI organization |
| `fields` | array | ✅ | Block fields (name, type, label, required) |
| `allowedChildren` | string[] | | Component IDs allowed as children (for container blocks) |

### scaffold_project

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `projectType` | enum | ✅ | | `standard`, `repoless-code`, `repoless-content` |
| `siteName` | string | ✅ | | Project/site name |
| `contentSource` | enum | | `google-drive` | `google-drive` or `sharepoint` |
| `includeUE` | boolean | | `false` | Include Universal Editor component model files |
| `includeCommerce` | boolean | | `false` | Include Commerce Drop-in integration setup |

### validate_block

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `blockName` | string | ✅ | Block name |
| `js` | string | | Block JS contents |
| `css` | string | | Block CSS contents |
| `json` | string | | Component model JSON |
| `content` | string | | Sample content markdown |

### check_performance

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `blockName` | string | ✅ | | Block name |
| `js` | string | | | Block JS file contents |
| `css` | string | | | Block CSS file contents |
| `isAboveFold` | boolean | | `false` | Whether block appears above the fold (eager-loaded) |

### explain_dom

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `blockName` | string | ✅ | | Block name |
| `variant` | string | | | Block variant (e.g. "dark", "wide") |
| `rows` | number | | `2` | Number of content rows (1–20) |
| `columns` | number | | `2` | Number of columns per row (1–6) |
| `cellContents` | string[][] | | | Specific cell contents as 2D array [row][col] |

### lookup_block

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `query` | string | ✅ | Block name or description to search for (e.g. "hero", "tabbed content") |

### search_block_collection

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `query` | string | ✅ | | Block name or type to search for |
| `source` | enum | | `both` | `collection` (Adobe official), `party` (community), or `both` |

### eds_config

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `configType` | enum | ✅ | | `fstab`, `fstab-sharepoint`, `fstab-repoless`, `head-html`, `redirects`, `headers`, `robots`, `sitemap`, `helix-config`, `metadata`, `repoless`, `all` |
| `domain` | string | | | Your site domain |
| `contentSource` | enum | | `google-drive` | `google-drive` or `sharepoint` |
| `folderId` | string | | | Google Drive folder ID or SharePoint path |

### eds_scripts_guide

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `topic` | enum | ✅ | `scripts-js-overview`, `load-eager`, `load-lazy`, `load-delayed`, `auto-blocking`, `metadata`, `header-footer`, `custom-fonts`, `analytics`, `third-party`, `decorateMain`, `all` |

## Architecture

```
eds-mcp-server/
├── src/
│   ├── index.ts              # Server entry point — registers all tools
│   ├── tools/
│   │   ├── scaffold-block.ts   # Generate block files
│   │   ├── scaffold-model.ts   # Generate UE model files
│   │   ├── scaffold-project.ts # New project guide
│   │   ├── validate-block.ts   # Block validation
│   │   ├── explain-dom.ts      # Content → DOM mapping
│   │   ├── eds-config.ts       # Configuration templates
│   │   ├── check-performance.ts # Performance analysis
│   │   ├── lookup-block.ts     # Block pattern search
│   │   ├── search-block-collection.ts # GitHub API block search
│   │   └── eds-scripts.ts      # Scripts customization guide
│   ├── resources/
│   │   └── eds-resources.ts    # Documentation as MCP resources
│   ├── prompts/
│   │   └── eds-prompts.ts      # Prompt templates
│   └── knowledge/
│       ├── eds-conventions.ts  # EDS rules, constraints, templates
│       └── block-templates.ts  # Code generators
├── package.json
├── tsconfig.json
├── LICENSE
├── evaluations.xml
└── README.md
```

**Key design decisions:**
- **No LLM dependency** — the server provides tools and knowledge; your IDE's LLM does the reasoning
- **No API keys** — pure static analysis, scaffolding, and documentation (except `search_block_collection` which queries public GitHub API)
- **Convention-encoded** — EDS rules are hardcoded into validators and generators
- **Tool annotations** — all tools declare `readOnlyHint`, `destructiveHint`, `idempotentHint`, and `openWorldHint`
- **Stdio transport** — works with any MCP client (Cursor, VS Code, Claude Code)

## Evaluations

The `evaluations.xml` file contains 10 LLM-facing integration test Q&A pairs. Each question requires calling one or more MCP tools and verifying the response matches expected behavior. Use these with the MCP Inspector to validate the server end-to-end.

## EDS Resources

- [AEM Edge Delivery Services docs](https://www.aem.live/)
- [AEM Boilerplate](https://github.com/adobe/aem-boilerplate)
- [Block Collection](https://www.aem.live/developer/block-collection)
- [Block Party (community)](https://github.com/aem-block-collection/block-party)
- [Keeping it 100 (performance)](https://www.aem.live/developer/keeping-it-100)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add tools in `src/tools/`, knowledge in `src/knowledge/`
4. Test with `npm run inspect`
5. Submit a PR

## License

MIT
