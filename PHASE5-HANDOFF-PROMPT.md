# Phase 5 Implementation - Handoff Prompt for Claude Code

**Date**: 2025-12-04
**From**: Previous Claude Code session (Sonnet 4.5)
**To**: Next Claude Code session
**Recommended Model**: Claude 3.5 Sonnet (200k context) or Claude Opus 4.5 (maximum reasoning)

---

## VERIFIED STATE - DO NOT RE-INVESTIGATE

The following has been **completed, tested in real browser, and validated**:

### Phase 4 & 4.5: COMPLETE ✅
- D3.js force-directed graph visualization (working)
- 5-dimension valence scoring system (trust, communication, support, respect, alignment) with -5 to +5 sliders
- localStorage persistence with auto-save (working)
- Export functionality with sanitization (working)
- Input sanitization for XSS prevention (tested with `<script>alert("XSS")</script>` payload - blocked)
- TypeScript builds clean
- Git commits documented (ba0f148, f4c8818)

**Evidence**: [PHASE4-VALIDATION-REPORT.md](PHASE4-VALIDATION-REPORT.md) - 530 lines of real browser test results

### Human Decisions: DOCUMENTED ✅
All critical architectural decisions have been made by the human:
- **Decision 1**: Full Phase 5 scope approved (import + error boundaries + keyboard nav + UX polish)
- **Decision 2**: Migrate from 5-dimension valence to **Strong/Moderate/Weak trust scoring**
- **Decision 3**: Pilot context - 2 ProActive coaches + ~20 clients (10 per coach)
- **Decision 4**: Two separate arrows with different colors for bidirectional trust
- **Decision 5**: Preserve 5-dimension data in `valenceDetail` field for future enhancement
- **Decision 6**: Client self-mapping features (simplified UI, save/return, share with coach)

**Evidence**: [PHASE5-IMPLEMENTATION-SPEC.md](PHASE5-IMPLEMENTATION-SPEC.md) - Complete specification document (529 lines)

### BMAD-METHOD Installation: VERIFIED ✅
- BMAD-METHOD v6-alpha.10 installed (379 files in .bmad/)
- 17 agent definitions available
- 27+ workflows across all 5 BMAD phases
- Health check passes all 6 checks
- `.agent/` workflows configured for IDE integration
- AgentVibes TTS system operational (33 slash commands)

**Evidence**: Git commit b326f35 - "feat(bmad): Complete BMAD-METHOD v6-alpha installation and setup"

### What You DO NOT Need to Do:
- ❌ Investigate current implementation (it's documented)
- ❌ Re-run validation tests (they're in PHASE4-VALIDATION-REPORT.md)
- ❌ Re-analyze brainstorming notes (decisions already made)
- ❌ Ask clarifying questions about architecture (specification is complete)
- ❌ Re-install BMAD (it's installed and operational)

---

## YOUR MISSION

Implement **Phase 5A** and **Phase 5B** per [PHASE5-IMPLEMENTATION-SPEC.md](PHASE5-IMPLEMENTATION-SPEC.md).

### Phase 5A: Trust Scoring Redesign (6-8 hours)
**Goal**: Migrate from 5-dimension valence to Strong/Moderate/Weak trust scoring while preserving extensibility.

**Critical Requirements**:
1. **Type definitions** - Update `Valence` interface to use `TrustScore` and `valenceDetail`
2. **Migration utility** - Create `app/src/utils/migrate.ts` with conversion logic
3. **UI redesign** - Replace sliders in `ValenceEditor.tsx` with radio buttons
4. **Visualization update** - Color links by trust level (green/yellow/orange)
5. **Export/import compatibility** - Support both v1.0 (legacy) and v2.0 (new) formats
6. **localStorage migration** - Bump version 1→2, auto-migrate old data

**Non-Negotiable**:
- Must preserve existing test data (the "scriptalert(XSS)/script" node is intentional test data)
- Must support importing both old (5D) and new (trust score) exports
- Must NOT lose data during migration

### Phase 5B: Core Features (9-14 hours)
**Goal**: Complete pilot-critical functionality.

**Priority Order**:
1. **Import functionality** (FR-4.2) - HIGHEST PRIORITY
   - File upload with JSON validation
   - Schema checking
   - Version detection
   - Migration support for v1.0 files
   - Sanitization of imported data
2. **Error boundaries** - Prevent app crashes from propagating
3. **Keyboard navigation** - Tab, Enter, Escape, arrow keys
4. **UX polish** - Replace `prompt()` with modals, add confirmations, status indicators

**Acceptance Criteria**: See PHASE5-IMPLEMENTATION-SPEC.md sections 5A.6 and 5B.4

---

## META-ORCHESTRATION REQUIREMENTS

You are **not** acting as a single developer. You are the **meta-orchestrator** of a genius-level team (IQ 199+).

### Required Teams (ALWAYS Include):

#### 1. Red Team 🔴
**Role**: Challenge every assumption, find edge cases, question "obvious" solutions
**Questions They Ask**:
- "What if the user imports a 50MB JSON file?"
- "What if localStorage is full?"
- "What if the migration function encounters NaN values?"
- "What happens if the user spams the import button 10 times?"

#### 2. Black Hat Team 🎩
**Role**: Adversarial security review, find vulnerabilities, test attack vectors
**Questions They Ask**:
- "Can I inject code through the import function?"
- "What if I manually edit localStorage to have version: 999?"
- "Can I crash the app by importing malformed JSON?"
- "What if I create a circular reference in the graph data?"

#### 3. Research Team 📚
**Role**: Validate current best practices, check React 19 patterns, verify D3.js v7 APIs
**Questions They Ask**:
- "Is this the idiomatic way to handle file uploads in React 19?"
- "Are we using the latest error boundary patterns?"
- "Is there a better accessibility pattern for keyboard navigation?"
- "Should we use `structuredClone()` instead of JSON.parse/stringify?"

#### 4. Implementation Team 💻
**Role**: Write clean, maintainable code following existing patterns
**Responsibilities**:
- Follow existing code style (functional components, named exports)
- Use existing utilities (sanitization functions, store patterns)
- Maintain TypeScript strict mode compliance
- Write tests as you go (if test framework available)

#### 5. Validation Team ✅
**Role**: Real browser testing, not simulation
**Requirements**:
- Use chrome-devtools MCP for **actual browser testing**
- Test with real data (import old exports, create new ones)
- Verify XSS protection still works with new trust scoring
- Test keyboard navigation in actual browser
- Test error boundary triggering (intentionally break something)

### Orchestration Protocol:

1. **Before implementing each file**:
   - Red Team reviews the plan
   - Black Hat identifies security concerns
   - Research Team validates approach
   - Implementation Team codes
   - Validation Team tests

2. **Real-life validation REQUIRED**:
   - ❌ Do NOT claim "it should work" or "this would work"
   - ✅ DO test in real browser using chrome-devtools MCP
   - ✅ DO verify with actual data
   - ✅ DO intentionally try to break it

3. **Create new resources as needed**:
   - If you need a new BMAD agent, create it in `.bmad/agents/`
   - If you need a new workflow, create it in `.agent/`
   - If you need a new MCP server, document why and what it would do
   - If you need a new utility, add it to `app/src/utils/`

---

## BMAD-METHOD INTEGRATION

You have BMAD-METHOD v6-alpha.10 installed. **Use it.**

### Available BMAD Resources:

#### Agents (17 available)
- **Analyst** - Requirements analysis, gap identification
- **Architect** - System design, migration strategies
- **Dev** - Implementation, code generation
- **TEA** (Test Engineering Agent) - Test strategy, validation plans
- **SM** (Security Manager) - Security review, threat modeling

**How to Use**:
```bash
npx bmad-method *agent [name]  # Spawn agent
npx bmad-method *workflow-init  # Initialize workflow
```

#### Workflows (27+ available)
- Phase 4 workflows (implementation)
- Phase 5 workflows (validation & deployment)
- Cross-cutting workflows (security, testing, documentation)

**Recommendation**: Use **Phase 4 Implementation Workflow** as this is feature development.

### BMAD-Optimized Approach:

**Step 1: Requirements Validation (Analyst + Architect)**
- Review PHASE5-IMPLEMENTATION-SPEC.md
- Identify any ambiguities or missing details
- Create implementation checklist

**Step 2: Security Review (SM + Black Hat Team)**
- Review migration utility for data integrity
- Review import function for injection vulnerabilities
- Review error boundaries for information leakage

**Step 3: Implementation Plan (Architect + Dev)**
- Determine file modification order
- Identify dependencies between changes
- Plan rollback strategy

**Step 4: Implementation (Dev + Red Team)**
- Implement Phase 5A (trust scoring redesign)
- Red Team reviews each file
- Commit after each major component

**Step 5: Feature Implementation (Dev + Validation Team)**
- Implement Phase 5B (import, error boundaries, keyboard nav, UX)
- Test each feature in real browser as you go
- Document any deviations from spec

**Step 6: Comprehensive Testing (TEA + Validation Team)**
- Real browser testing with chrome-devtools MCP
- Test all acceptance criteria from spec
- Test with both v1.0 and v2.0 export files
- Test error scenarios (malformed JSON, huge files, etc.)

**Step 7: Validation Report (All Teams)**
- Create PHASE5-VALIDATION-REPORT.md
- Document test results with evidence (screenshots, console logs)
- Document any issues found and how they were resolved
- Document any deviations from spec and why

**Step 8: Handoff (Meta-Orchestrator)**
- Commit all changes with detailed commit message
- Update README.md with new features
- Update SECURITY.md if new risks identified
- Provide next steps for Phase 6 (if any)

---

## REFERENCE DOCUMENTS

**Primary Specification**: [PHASE5-IMPLEMENTATION-SPEC.md](PHASE5-IMPLEMENTATION-SPEC.md) - This is your source of truth. All technical details are there.

**Previous Validation**: [PHASE4-VALIDATION-REPORT.md](PHASE4-VALIDATION-REPORT.md) - Shows what real browser testing looks like.

**Security Context**: [SECURITY.md](SECURITY.md) - Current risk posture, vulnerabilities to watch for.

**Architecture Context**: [app/README.md](app/README.md) - Tech stack, patterns, conventions.

**Type Definitions**: [app/src/types/index.ts](app/src/types/index.ts) - Current state (needs updating).

**State Management**: [app/src/lib/store.ts](app/src/lib/store.ts) - Current implementation (needs migration logic).

---

## CRITICAL SUCCESS FACTORS

### Must Have:
1. ✅ Import functionality working with both v1.0 and v2.0 files
2. ✅ Trust scoring UI redesigned (radio buttons, not sliders)
3. ✅ Migration function converts old data without loss
4. ✅ Real browser testing completed (not simulated)
5. ✅ All existing features still work (don't break Phase 4)
6. ✅ TypeScript builds without errors
7. ✅ Validation report documents evidence

### Must NOT:
1. ❌ Break existing functionality (Phase 4 features must still work)
2. ❌ Lose data during migration (preserve the test data)
3. ❌ Introduce new XSS vulnerabilities (sanitization still required)
4. ❌ Skip real browser testing (chrome-devtools MCP required)
5. ❌ Claim validation without evidence (screenshots, logs, console output)
6. ❌ Over-engineer (follow spec, don't add extra features)
7. ❌ Skip the Red Team and Black Hat reviews (security is non-negotiable)

---

## ESTIMATED TIMELINE

**Total: 15-22 hours** (per PHASE5-IMPLEMENTATION-SPEC.md)

- Phase 5A: 6-8 hours (trust scoring redesign)
- Phase 5B: 9-14 hours (core features)

**If you encounter blockers**:
- Document the blocker clearly
- Explain what you tried
- Ask specific questions (not open-ended "what should I do?")
- Propose 2-3 options with trade-offs

**If you finish early**:
- Run additional security tests (Black Hat Team)
- Test with larger datasets (50+ nodes)
- Check accessibility with screen reader
- Document findings in validation report

---

## MODEL RECOMMENDATION

**Recommended**: **Claude 3.5 Sonnet** (200k context)

**Rationale**:
- Extended context needed for 15-22 hour implementation
- Excellent TypeScript and React coding capability
- Good balance of speed and reasoning
- Can handle long file reads and multi-file changes

**Alternative**: **Claude Opus 4.5** (maximum reasoning)

**When to Use Opus**:
- If you hit complex architectural decisions not in spec
- If migration logic becomes more complex than anticipated
- If security concerns require deep reasoning
- Trade-off: 100k context (shorter) but stronger reasoning

**Not Recommended**: Claude Haiku
- Insufficient context for this task size
- May struggle with complex migration logic

---

## FINAL CHECKLIST BEFORE HANDOFF

After completing Phase 5A and 5B:

- [ ] Import functionality tested with real files (both v1.0 and v2.0)
- [ ] Trust scoring UI redesigned and tested in real browser
- [ ] Migration function tested with old localStorage data
- [ ] Error boundaries tested (intentionally break something)
- [ ] Keyboard navigation tested in real browser
- [ ] All Phase 4 features still work (regression testing)
- [ ] TypeScript builds clean
- [ ] PHASE5-VALIDATION-REPORT.md created with evidence
- [ ] SECURITY.md updated if new risks identified
- [ ] README.md updated with new features
- [ ] Git commits follow conventional format (`feat:`, `fix:`, etc.)
- [ ] All commits pushed to main branch

---

## QUESTIONS FOR THE HUMAN (If Needed)

**Only ask if you encounter genuine blockers not addressed in the spec.**

Example acceptable questions:
- "The migration function encounters a valence object with `trust: Infinity`. Should I treat this as strong (>2) or unscored?"
- "The import function successfully parses a 10MB JSON file but causes the browser to freeze for 5 seconds. Should I add a loading spinner or chunk the processing?"
- "The error boundary testing revealed that D3.js simulation errors don't trigger the boundary. Should I add try-catch around D3 force simulation?"

Example unacceptable questions:
- "How should I implement the migration function?" (It's specified in detail)
- "What should the import UI look like?" (It's in the spec)
- "Should I use Strong/Moderate/Weak or High/Medium/Low?" (Decision already made)

---

## START HERE

1. Read [PHASE5-IMPLEMENTATION-SPEC.md](PHASE5-IMPLEMENTATION-SPEC.md) in full (529 lines)
2. Verify current git status (should be clean, main branch)
3. Run `npm run build` to confirm Phase 4 builds clean
4. Run `npm run dev` to confirm app works (http://localhost:5173/true-valence-mapper-bmad/)
5. Take a browser snapshot to document starting state
6. Begin Phase 5A implementation with meta-orchestration approach

---

**Good luck. The specification is complete. The path is clear. Execute with confidence.**

**Remember**: You are orchestrating genius-level teams. Use them. Challenge yourself. Validate in real life. Build something excellent.

---

**Meta-Orchestrator**: Previous Claude Code session (Sonnet 4.5)
**Handoff Date**: 2025-12-04
**Project**: True Valence Mapper (BMAD Edition)
**Phase**: 5A + 5B Implementation
**Expected Completion**: Phase 5 VALIDATED and READY FOR PILOT
