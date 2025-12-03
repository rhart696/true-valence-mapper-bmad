# BMAD Adoption Checklist for AI Agents

> **CRITICAL**: Run this checklist BEFORE executing any BMAD commands.
> This prevents the silent failure mode where BMAD appears configured but isn't installed.

## Pre-Flight Verification (MANDATORY)

### Step 1: Verify Dependencies Declared
```bash
grep "bmad-method" package.json
```
**Expected**: `"bmad-method": "X.X.X"` (any version)
**If missing**: BMAD is not configured for this project

### Step 2: Verify Dependencies Installed
```bash
ls -la node_modules/bmad-method 2>/dev/null || echo "NOT INSTALLED"
```
**Expected**: Directory listing with package contents
**If "NOT INSTALLED"**: Run `npm install` first

### Step 3: Verify CLI Works
```bash
npx bmad-method --version
```
**Expected**: Version number (e.g., `v6.0.0-alpha.10`)
**If fails**: Dependencies not installed correctly

### Step 4: Verify BMAD Initialized
```bash
ls -la .bmad/ 2>/dev/null || echo "NOT INITIALIZED"
```
**Expected**: Directory with agents/, workflows/, etc.
**If "NOT INITIALIZED"**: Run `npm run install-bmad`

### Step 5: Quick Health Check (Combines All Above)
```bash
npm run bmad:check
# OR
bash scripts/bmad-health-check.sh
```
**Expected**: "ALL CHECKS PASSED"
**If fails**: Follow remediation steps in output

---

## Decision Gate

| All Checks Pass? | Action |
|------------------|--------|
| YES | Proceed with BMAD commands |
| NO | Run remediation, then re-check |

---

## Remediation Commands

### If Step 2 Failed (dependencies not installed):
```bash
npm install
npm run bmad:check  # Verify fix
```

### If Step 4 Failed (.bmad/ missing):
```bash
npm run install-bmad
# OR
npx bmad-method install
npm run bmad:check  # Verify fix
```

### If Memory Issues (Stream closed errors):
```bash
NODE_OPTIONS="--max-old-space-size=4096" npm run install-bmad
```

### Nuclear Option (start fresh):
```bash
rm -rf node_modules/ .bmad/ package-lock.json
npm install
npm run install-bmad
npm run bmad:check
```

---

## AI Agent Behavioral Rules

### BEFORE suggesting ANY BMAD command:
1. Run `npm run bmad:check` or equivalent
2. Report status explicitly to user
3. DO NOT proceed if checks fail
4. Request user to run remediation manually if needed

### BEFORE suggesting phase-specific workflows:
1. Verify `.bmad/` exists
2. Check which phase documentation exists in `docs/bmad/`
3. Only suggest commands appropriate for current phase

### When BMAD commands fail:
1. First assume installation issue (most common)
2. Run health check to diagnose
3. Report specific failure to user
4. Suggest remediation steps

---

## Common Failure Modes

| Symptom | Likely Cause | Fix |
|---------|--------------|-----|
| `bmad: command not found` | npm install not run | `npm install` |
| `.bmad/` missing | BMAD not initialized | `npm run install-bmad` |
| `Stream closed` error | Memory exhaustion | Add `NODE_OPTIONS="--max-old-space-size=4096"` |
| `*agent analyst` doesn't work | Not in AI chat context | Use in Claude Code, not terminal |
| Commands in docs fail | Docs written before install | Run health check first |

---

## Success Indicators

You know BMAD is properly installed when:
- [ ] `npm run bmad:check` returns "ALL CHECKS PASSED"
- [ ] `node_modules/bmad-method/` exists
- [ ] `.bmad/` directory exists with subdirectories
- [ ] `npx bmad-method --version` returns a version
- [ ] `npx bmad-method status` shows installation info

---

## For This Project Specifically

**Project Type**: Brownfield (existing code)
**Current Phase**: Phase 3→4 (Solutioning to Implementation)
**Pilot Focus**: 2 ProActive coaches

**Key BMAD Commands for This Project**:
```bash
# Check status
npx bmad-method status

# For brownfield development
*create-brownfield-story

# Load agents
*agent dev      # For implementation
*agent analyst  # For requirements clarification
```

---

## Version History

- v1.0 (2025-12-03): Initial checklist created after discovery that BMAD was declared but never installed

---

*This checklist exists because silent failures are worse than loud failures.*
*Always verify before assuming.*
