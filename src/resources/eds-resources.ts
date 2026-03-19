import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import {
  PROJECT_STRUCTURE,
  HARD_CONSTRAINTS,
  BLOCK_DOM_PIPELINE,
  CSS_SCOPING_RULES,
  LOADING_LIFECYCLE,
  FIELD_TYPES,
} from '../knowledge/eds-conventions.js';

/**
 * Register MCP Resources — static knowledge the IDE's LLM can reference.
 *
 * COMMUNITY TIER: Resources expose only public EDS knowledge
 * from aem.live documentation. Premium knowledge (BLOCK_HTML_CONTRACT,
 * DECORATE_TEMPLATE, FIELD_COLLAPSE_RULES, PERFORMANCE_RULES,
 * CONFIG_TEMPLATES, REPOLESS_GUIDE, BLOCK_PATTERNS) is NOT exposed
 * via resources — it stays behind premium tools.
 */
export function registerResources(server: McpServer) {
  // ─── EDS Coding Standards (Public) ──────────────────────
  server.resource(
    'eds-coding-standards',
    'eds://docs/coding-standards',
    {
      description: 'AEM EDS coding standards: constraints, conventions, file structure, and rules from aem.live documentation',
      mimeType: 'text/markdown',
      annotations: {
        audience: ['assistant'] as const,
        priority: 1,
      },
    },
    async (uri) => ({
      contents: [
        {
          uri: uri.href,
          mimeType: 'text/markdown',
          text:
            `# AEM Edge Delivery Services — Coding Standards\n\n` +
            `## Hard Constraints\n${HARD_CONSTRAINTS.map((c) => `- ${c}`).join('\n')}\n\n` +
            `## Project Structure\n\`\`\`\n${PROJECT_STRUCTURE}\n\`\`\`\n\n` +
            `${CSS_SCOPING_RULES}\n\n` +
            `${LOADING_LIFECYCLE}`,
        },
      ],
    })
  );

  // ─── Block Development Guide (Public) ───────────────────
  server.resource(
    'eds-block-guide',
    'eds://docs/block-development',
    {
      description: 'How to build EDS blocks: DOM pipeline, CSS scoping, and content authoring tables',
      mimeType: 'text/markdown',
      annotations: {
        audience: ['assistant'] as const,
        priority: 0.8,
      },
    },
    async (uri) => ({
      contents: [
        {
          uri: uri.href,
          mimeType: 'text/markdown',
          text:
            `# EDS Block Development Guide\n\n` +
            `${BLOCK_DOM_PIPELINE}\n\n` +
            `## The Decorate Function\n\nEvery block must export a default \`decorate(block)\` function that receives the block DOM element and transforms it.\n\n` +
            `\`\`\`javascript\nexport default function decorate(block) {\n  const rows = [...block.children];\n  rows.forEach((row) => {\n    const cells = [...row.children];\n    // Process cells\n  });\n}\n\`\`\`\n\n` +
            `${CSS_SCOPING_RULES}\n\n` +
            `## Component Model Field Types\n\n` +
            FIELD_TYPES.map((f) => `- \`${f.component}\` (${f.valueType}): ${f.description}`).join('\n'),
        },
      ],
    })
  );

  // ─── Quick Reference Card (Public) ──────────────────────
  // NOTE: eds-config-reference resource REMOVED — contains
  // REPOLESS_GUIDE and premium config templates. Config
  // guidance is available only via the eds_config tool.
  server.resource(
    'eds-cheatsheet',
    'eds://docs/cheatsheet',
    {
      description: 'Quick reference card for EDS development — common patterns, file locations, CLI commands, and URLs',
      mimeType: 'text/markdown',
      annotations: {
        audience: ['user', 'assistant'] as const,
        priority: 0.5,
      },
    },
    async (uri) => ({
      contents: [
        {
          uri: uri.href,
          mimeType: 'text/markdown',
          text: `# EDS Quick Reference

## CLI Commands
- \`npm i -g @adobe/aem-cli\` — Install AEM CLI
- \`aem up\` — Start local dev server (port 3000)
- \`aem up --port 3001\` — Custom port

## URLs
- Preview: \`https://main--<repo>--<org>.aem.page/\`
- Live: \`https://main--<repo>--<org>.aem.live/\`
- Admin: \`https://admin.hlx.page/\`

## Block Files
- \`blocks/<name>/<name>.js\` — Block JavaScript (decorate function)
- \`blocks/<name>/<name>.css\` — Block styles (scoped to .<name>)

## Key Patterns
\`\`\`javascript
// Block JS — always this signature
export default function decorate(block) { ... }

// Read metadata
import { getMetadata } from '../../scripts/aem.js';
const title = getMetadata('title');
\`\`\`

## CSS Variables (from styles/styles.css)
\`\`\`css
var(--link-color)         /* Primary link/button color */
var(--link-hover-color)   /* Hover state */
var(--background-color)   /* Page background */
var(--text-color)         /* Body text */
var(--heading-color)      /* Heading text */
var(--nav-height)         /* Navigation bar height */
\`\`\`

## Content Authoring
- Tables in Google Docs/Word → blocks
- First row = block name (+ variant in parentheses)
- Metadata section at page bottom
- Images auto-optimize through /.helix/media pipeline
`,
        },
      ],
    })
  );
}
