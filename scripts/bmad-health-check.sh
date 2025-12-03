#!/bin/bash

# BMAD Health Check - Run before assuming BMAD is ready
# Exit codes: 0 = all good, 1+ = failures detected
# Usage: npm run bmad:check OR bash scripts/bmad-health-check.sh

set -e
FAIL_COUNT=0
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

echo "========================================"
echo "  BMAD Health Check v1.0"
echo "  Project: $(basename "$PROJECT_ROOT")"
echo "  Time: $(date)"
echo "========================================"
echo ""

# Check 1: package.json has dependency
echo -n "[1/6] package.json declares bmad-method... "
if grep -q '"bmad-method"' package.json 2>/dev/null; then
  VERSION=$(grep '"bmad-method"' package.json | grep -o '[0-9][^"]*')
  echo "PASS (v$VERSION)"
else
  echo "FAIL"
  echo "      Fix: Add bmad-method to package.json dependencies"
  ((FAIL_COUNT++))
fi

# Check 2: npm modules installed
echo -n "[2/6] npm dependencies installed... "
if [ -d "node_modules/bmad-method" ]; then
  echo "PASS"
else
  echo "FAIL"
  echo "      Fix: Run 'npm install' in project root"
  ((FAIL_COUNT++))
fi

# Check 3: CLI available
echo -n "[3/6] BMAD CLI executable... "
if npx bmad-method --version &>/dev/null; then
  CLI_VERSION=$(npx bmad-method --version 2>&1 | head -1)
  echo "PASS ($CLI_VERSION)"
else
  echo "FAIL"
  echo "      Fix: Run 'npm install' then retry"
  ((FAIL_COUNT++))
fi

# Check 4: BMAD initialized
echo -n "[4/6] BMAD project initialized (.bmad/)... "
if [ -d ".bmad" ]; then
  AGENT_COUNT=$(find .bmad -name "*.md" -type f 2>/dev/null | wc -l)
  echo "PASS ($AGENT_COUNT files)"
else
  echo "FAIL"
  echo "      Fix: Run 'npx bmad-method install' or 'npm run install-bmad'"
  ((FAIL_COUNT++))
fi

# Check 5: Phase documentation
echo -n "[5/6] BMAD phase documentation exists... "
if [ -d "docs/bmad" ]; then
  PHASE_COUNT=$(find docs/bmad -maxdepth 1 -type d | wc -l)
  echo "PASS ($((PHASE_COUNT - 1)) phases)"
else
  echo "WARN (manual docs exist, but no BMAD-generated structure)"
fi

# Check 6: MCP server (if present)
echo -n "[6/6] bmad-expert-mcp server... "
if [ -d "bmad-expert-mcp" ]; then
  if [ -d "bmad-expert-mcp/node_modules" ]; then
    echo "PASS (installed)"
  else
    echo "WARN (exists but deps not installed)"
    echo "      Fix: cd bmad-expert-mcp && npm install"
  fi
else
  echo "SKIP (not present in this project)"
fi

# Summary
echo ""
echo "========================================"
if [ $FAIL_COUNT -eq 0 ]; then
  echo "  RESULT: ALL CHECKS PASSED"
  echo "  BMAD is ready for use."
  echo "========================================"
  exit 0
else
  echo "  RESULT: $FAIL_COUNT CHECK(S) FAILED"
  echo "  See above for remediation steps."
  echo "========================================"
  echo ""
  echo "Quick Fix Commands:"
  echo "  1. npm install                    # Install dependencies"
  echo "  2. npm run install-bmad           # Initialize BMAD"
  echo "  3. npm run bmad:check             # Re-run this check"
  exit 1
fi
