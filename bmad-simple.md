# BMAD Simple: The 80/20 Approach

## What You Really Need (20% effort, 80% value)

### 1. Project Type Decision Tree
```
Is this new code from scratch?
├─ YES → Greenfield → Start with Analysis phase
└─ NO → Brownfield → Start with Documentation phase
    └─ Your project: TRUE-VALENCE-MAPPER (existing code)
```

### 2. Your Actual Workflow (Brownfield)

```bash
# Step 1: Document what exists (10 min)
echo "## Existing Architecture" > docs/current-state.md
echo "- Relationship mapping logic" >> docs/current-state.md
echo "- Valence calculation algorithms" >> docs/current-state.md
echo "- BMAD integration points" >> docs/current-state.md

# Step 2: Define the enhancement (20 min)
cat > docs/enhancement-story.md << 'EOF'
## Story: Integrate BMAD Validation Patterns

### Acceptance Criteria
1. Relationships validate against BMAD patterns
2. Valence calculations are traceable
3. Errors provide actionable feedback

### Technical Approach
- Add validation layer using BMAD principles
- Keep existing logic intact
- Progressive enhancement pattern
EOF

# Step 3: Implement with discipline (2 hrs)
# Just code with these principles:
# - One acceptance criterion at a time
# - Test before moving to next
# - Document decisions inline
```

### 3. Forget Complex Agents, Use These Prompts

```markdown
## When Starting
"I have an existing project [describe]. Should I use Greenfield or Brownfield BMAD approach?"

## When Planning
"Create a story for [feature] with acceptance criteria following BMAD patterns"

## When Implementing
"Review this code against BMAD story acceptance criteria: [paste story]"

## When Stuck
"What BMAD phase handles [problem type]?"
```

### 4. Git-Based "Memory" (Better than MCP servers)

```bash
# Track BMAD workflow state with git
git branch bmad-brownfield-main
git checkout -b bmad/document
# ... work ...
git commit -m "BMAD Phase 0: Document existing system"

git checkout -b bmad/enhance
# ... work ...
git commit -m "BMAD Phase 4: Implement enhancement"

# See your BMAD history
git log --oneline --grep="BMAD"
```

### 5. Security Without Complexity

```bash
# Instead of MCP servers with vulnerabilities:
# Use local aliases that can't be exploited

alias bmad-check='echo "Current phase: $(git branch --show-current | cut -d/ -f2)"'
alias bmad-validate='grep -c "✓" docs/enhancement-story.md'
alias bmad-next='echo "Next: Complete acceptance criteria $(bmad-validate)/$(grep -c "^[0-9]" docs/enhancement-story.md)"'
```

## Why This is Better

| Complex Approach | Simple Approach | Why Simple Wins |
|-----------------|-----------------|------------------|
| MCP servers with vulnerabilities | Bash aliases | No attack surface |
| 19 specialized agents | 4 prompt templates | Cognitive clarity |
| Document sharding system | One markdown file | Direct manipulation |
| Custom task master | Git branches | Industry standard |
| XML configuration files | Plain text notes | Human readable |
| Phase enforcement engine | Developer discipline | Flexibility |

## Implementation Checklist

- [ ] Delete the complex MCP server (`rm -rf bmad-expert-mcp/`)
- [ ] Simplify `.vscode/mcp.json` to just filesystem access
- [ ] Create `docs/` directory for BMAD artifacts
- [ ] Set up git branches for phase tracking
- [ ] Save the 4 prompts as snippets
- [ ] Start coding, not configuring

## The One Command You Need

```bash
# This replaces everything:
echo "What BMAD phase should I be in for: $(ls docs/ 2>/dev/null | head -3)"
```

---

**Remember**: BMAD is a methodology, not a technology stack. Use the ideas, skip the infrastructure.