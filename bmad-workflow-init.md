# BMAD Workflow Initialization for True-Valence-Mapper

## Project Classification: Brownfield

You have existing code (true-valence-mapper) that you're enhancing with BMAD patterns.

## Recommended Workflow Track: BMad Method

- **Quick Flow**: ❌ (Too simple - for bug fixes only)
- **BMad Method**: ✅ (Perfect for learning and medium complexity)
- **Enterprise**: ❌ (Overkill for this project)

## Your BMAD Journey

### Phase 0: Documentation (Current)
**Agent**: Documentation Specialist
**Goal**: Understand existing true-valence-mapper codebase

```bash
# Create documentation of current state
mkdir -p docs/bmad
cat > docs/bmad/current-state.md << 'EOF'
# True Valence Mapper - Current State

## Existing Components
- Relationship mapping logic
- Valence calculation algorithms
- Basic validation patterns

## Integration Points
- Where BMAD patterns will enhance validation
- How relationship mapping aligns with BMAD stories
- Valence calculations as acceptance criteria
EOF
```

### Phase 1: Analysis (Next)
**Agent**: Analyst (Mary)
**Command**: `*agent analyst`
**Output**: Project brief with market research

### Phase 2: Planning
**Agent**: PM (John)
**Command**: `*agent pm`
**Workflow**: `*create-brownfield-epic`
**Output**: Requirements and user stories

### Phase 3: Solutioning
**Agent**: Architect (Winston)
**Command**: `*agent architect`
**Output**: Technical architecture for enhancements

### Phase 4: Implementation
**Agent**: Dev (Amelia)
**Command**: `*agent dev`
**Workflow**: `*develop-story`
**Output**: Code following story-driven development

## Your First BMAD Command

Since this is Brownfield, start with:

```
*document-project
```

This will analyze your existing code and create a foundation for enhancement.

## Alternative: Direct Story Creation

If you already understand your codebase, jump to:

```
*create-brownfield-story
```

Title: "Integrate BMAD validation patterns into valence calculations"

## Using These Commands

These `*` commands work in AI chat interfaces. In this conversation, just type:
- `*document-project` to start documentation
- `*create-brownfield-story` to create your first story
- `*agent analyst` to get market analysis

I'll interpret and execute the appropriate BMAD workflow.

## Manual Equivalent

Without AI chat, create these files manually:

```bash
# 1. Document current state
echo "# Current Architecture" > docs/bmad/architecture.md

# 2. Create enhancement story
cat > docs/bmad/stories/001-bmad-validation.md << 'EOF'
# Story: BMAD Validation Integration

## Acceptance Criteria
1. [ ] Relationships validate against BMAD patterns
2. [ ] Valence calculations include traceability
3. [ ] Errors provide actionable BMAD-style feedback

## Technical Context
- Existing validation: [describe]
- BMAD patterns to apply: [list]
- Expected outcomes: [define]
EOF
```

## Summary

You're on the **Brownfield → BMad Method** track. Start with documentation phase, then create focused enhancement stories. The methodology is more important than the tooling.