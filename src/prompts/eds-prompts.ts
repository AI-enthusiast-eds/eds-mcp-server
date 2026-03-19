import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { HARD_CONSTRAINTS } from '../knowledge/eds-conventions.js';

/**
 * Register MCP Prompts — pre-built templates for common EDS development tasks.
 * These appear as slash commands in IDEs (e.g., /mcp.eds.new-block).
 */
export function registerPrompts(server: McpServer) {
  // ─── New Block Prompt ───────────────────────────────────
  server.prompt(
    'new-block',
    'Step-by-step guide for creating a new EDS block from scratch',
    {
      blockName: z.string().describe('Block name in kebab-case (e.g. "product-card")'),
      description: z.string().describe('What this block should do and look like'),
    },
    ({ blockName, description }) => ({
      messages: [
        {
          role: 'user' as const,
          content: {
            type: 'text' as const,
            text:
              `Create an AEM EDS block named "${blockName}" that ${description}.\n\n` +
              `Requirements:\n` +
              `- Use vanilla JS and export default function decorate(block)\n` +
              `- Scope CSS to .${blockName}\n` +
              `- No npm/framework imports\n` +
              `- Mobile-first styles\n\n` +
              `Return only these files:\n` +
              `1. blocks/${blockName}/${blockName}.js\n` +
              `2. blocks/${blockName}/${blockName}.css\n` +
              `3. README.md`,
          },
        },
      ],
    })
  );

  // ─── Fix Block Prompt ───────────────────────────────────
  server.prompt(
    'fix-block',
    'Diagnose and fix issues with an existing EDS block',
    {
      blockName: z.string().describe('Block name'),
      issue: z.string().describe('What is going wrong (e.g. "styles leak to other blocks", "Lighthouse dropped to 85")'),
    },
    ({ blockName, issue }) => ({
      messages: [
        {
          role: 'user' as const,
          content: {
            type: 'text' as const,
            text:
              `Fix this EDS block issue for "${blockName}": ${issue}\n\n` +
              `Check only core EDS rules:\n` +
              `${HARD_CONSTRAINTS.slice(0, 6).map((c) => `- ${c}`).join('\n')}\n\n` +
              `Return:\n` +
              `1. Root cause\n` +
              `2. Corrected code\n` +
              `3. Short explanation`,
          },
        },
      ],
    })
  );

  // NOTE: migrate-to-eds and review-block prompts are available
  // in the premium tier only.
}
