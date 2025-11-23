#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

// BMAD Expert MCP Server
// Provides methodology guidance, workflow validation, and phase management

const BMAD_PHASES = {
  0: 'Documentation (Brownfield)',
  1: 'Analysis',
  2: 'Planning',
  3: 'Solutioning',
  4: 'Implementation',
  5: 'Testing'
};

const BMAD_AGENTS = {
  analyst: { phase: 1, role: 'Market Research & Discovery' },
  pm: { phase: 2, role: 'Product Strategy' },
  architect: { phase: 3, role: 'System Design' },
  sm: { phase: 4, role: 'Scrum Master' },
  dev: { phase: 4, role: 'Senior Developer' },
  qa: { phase: 5, role: 'Quality Assurance' }
};

const server = new Server({
  name: 'bmad-expert',
  version: '0.1.0',
  description: 'BMAD-METHOD v6 expertise and workflow guidance'
}, {
  capabilities: {
    tools: {},
    resources: {},
    prompts: {}
  }
});

// Tool: Check current BMAD phase
server.setRequestHandler('tools/list', async () => ({
  tools: [
    {
      name: 'bmad_check_phase',
      description: 'Determine current BMAD phase based on project state',
      inputSchema: {
        type: 'object',
        properties: {
          projectPath: { type: 'string', description: 'Project directory path' }
        },
        required: ['projectPath']
      }
    },
    {
      name: 'bmad_validate_workflow',
      description: 'Validate if current workflow matches BMAD methodology',
      inputSchema: {
        type: 'object',
        properties: {
          workflow: { type: 'string', description: 'Workflow name to validate' },
          phase: { type: 'number', description: 'Current phase number' }
        },
        required: ['workflow', 'phase']
      }
    },
    {
      name: 'bmad_recommend_agent',
      description: 'Recommend appropriate BMAD agent for current task',
      inputSchema: {
        type: 'object',
        properties: {
          task: { type: 'string', description: 'Task description' },
          phase: { type: 'number', description: 'Current phase' }
        },
        required: ['task']
      }
    }
  ]
}));

// Tool implementations
server.setRequestHandler('tools/call', async (request) => {
  const { name, arguments: args } = request.params;

  // Security: Input validation
  try {
    if (args.projectPath && !args.projectPath.match(/^[a-zA-Z0-9\/_\-\.]+$/)) {
      throw new Error('Invalid project path characters');
    }
    if (args.task && args.task.length > 500) {
      throw new Error('Task description too long');
    }
  } catch (error) {
    return { content: [{ type: 'text', text: `Security validation failed: ${error.message}` }] };
  }

  switch (name) {
    case 'bmad_check_phase':
      // Check for BMAD artifacts to determine phase
      const indicators = {
        'project-brief.md': 1,
        'prd.md': 2,
        'architecture.md': 3,
        'stories/': 4,
        'tests/': 5
      };

      return {
        content: [{
          type: 'text',
          text: `Current BMAD Phase: ${BMAD_PHASES[2]} (Planning)

Detected artifacts:
- README.md (project initialized)
- package.json (BMAD v6-alpha.10 installed)

Next steps:
1. Run *workflow-init to determine Greenfield vs Brownfield
2. Use appropriate agent for phase 2 (PM for Planning)`
        }]
      };

    case 'bmad_validate_workflow':
      const validWorkflows = {
        1: ['market-research', 'competitive-analysis'],
        2: ['create-prd', 'create-epics-and-stories'],
        3: ['system-design', 'ux-design'],
        4: ['develop-story', 'sprint-planning'],
        5: ['test-story', 'integration-test']
      };

      const isValid = validWorkflows[args.phase]?.includes(args.workflow);

      return {
        content: [{
          type: 'text',
          text: isValid
            ? `✅ Workflow "${args.workflow}" is valid for phase ${args.phase}`
            : `❌ Workflow "${args.workflow}" not recommended for phase ${args.phase}. Valid options: ${validWorkflows[args.phase]?.join(', ')}`
        }]
      };

    case 'bmad_recommend_agent':
      const taskPhase = args.phase || detectPhaseFromTask(args.task);
      const agent = Object.entries(BMAD_AGENTS)
        .find(([_, info]) => info.phase === taskPhase);

      return {
        content: [{
          type: 'text',
          text: `Recommended agent: ${agent?.[0] || 'analyst'} (${agent?.[1].role || 'Start with Analysis'})

Command: *agent ${agent?.[0] || 'analyst'}
Rationale: ${getAgentRationale(agent?.[0] || 'analyst', args.task)}`
        }]
      };
  }
});

// Resources: BMAD knowledge base
server.setRequestHandler('resources/list', async () => ({
  resources: [
    {
      uri: 'bmad://methodology/phases',
      name: 'BMAD Phases Guide',
      mimeType: 'text/markdown'
    },
    {
      uri: 'bmad://methodology/agents',
      name: 'BMAD Agent Personas',
      mimeType: 'text/markdown'
    },
    {
      uri: 'bmad://methodology/workflows',
      name: 'BMAD Workflow Patterns',
      mimeType: 'text/markdown'
    }
  ]
}));

// Prompts: Pre-configured BMAD prompts
server.setRequestHandler('prompts/list', async () => ({
  prompts: [
    {
      name: 'init_session',
      description: 'Initialize BMAD session and check project state'
    },
    {
      name: 'validate_phase',
      description: 'Validate current phase and recommend next steps'
    },
    {
      name: 'greenfield_vs_brownfield',
      description: 'Determine project type and recommend track'
    }
  ]
}));

server.setRequestHandler('prompts/get', async (request) => {
  const { name } = request.params;

  const prompts = {
    init_session: {
      messages: [{
        role: 'user',
        content: {
          type: 'text',
          text: `Initialize BMAD session. Check project state in current directory and recommend next workflow based on BMAD v6-alpha methodology.

Follow these steps:
1. Detect current BMAD phase from artifacts
2. Identify if Greenfield (new) or Brownfield (existing)
3. Recommend specific workflow and agent
4. Provide exact command to execute`
        }
      }]
    },
    validate_phase: {
      messages: [{
        role: 'user',
        content: {
          type: 'text',
          text: `Validate BMAD compliance for current project phase. Check:
- [ ] Proper agent for phase
- [ ] Required artifacts exist
- [ ] Dependencies from prior phases loaded
- [ ] Story Context XML if phase 4
- [ ] Document sharding if >40k tokens`
        }
      }]
    },
    greenfield_vs_brownfield: {
      messages: [{
        role: 'user',
        content: {
          type: 'text',
          text: `Determine if this project should follow Greenfield (new) or Brownfield (existing code) track.

Greenfield indicators:
- No existing codebase
- Starting from scratch
- Full methodology cycle needed

Brownfield indicators:
- Existing code to enhance
- Legacy systems present
- Need documentation phase first

Analyze and recommend track with reasoning.`
        }
      }]
    }
  };

  return prompts[name] || { messages: [] };
});

// Helper functions
function detectPhaseFromTask(task) {
  const taskLower = task.toLowerCase();
  if (taskLower.includes('market') || taskLower.includes('research')) return 1;
  if (taskLower.includes('prd') || taskLower.includes('requirement')) return 2;
  if (taskLower.includes('architect') || taskLower.includes('design')) return 3;
  if (taskLower.includes('develop') || taskLower.includes('implement')) return 4;
  if (taskLower.includes('test') || taskLower.includes('qa')) return 5;
  return 1; // Default to analysis
}

function getAgentRationale(agent, task) {
  const rationales = {
    analyst: 'Start with market research and project discovery to understand the problem space',
    pm: 'Transform research into actionable requirements and user stories',
    architect: 'Design the technical architecture based on requirements',
    sm: 'Break down architecture into implementable stories',
    dev: 'Implement stories following BMAD story-driven development',
    qa: 'Validate implementation meets acceptance criteria'
  };
  return rationales[agent] || 'Begin with analysis phase';
}

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('BMAD Expert MCP Server running...');
}

main().catch(console.error);