# Security & Risk Assessment

**Assessment Date:** 2025-12-03
**Status:** PROTOTYPE - Not production-ready
**Reviewers:** Red Team (Security) + Black Hat Team (Risk Analysis)

## Executive Summary

This application is a **functional prototype** with critical security vulnerabilities and data loss risks. It demonstrates core functionality but requires significant hardening before production deployment.

**Overall Risk Level:** CRITICAL

## Critical Security Findings (Must Fix)

### CRITICAL-001: Hardcoded Authentication Credentials
**Location:** `app/src/lib/store.ts:5`, `app/src/components/auth/LoginPage.tsx:66`

Hardcoded email whitelist in source code allows authentication bypass:
```typescript
const ALLOWED_EMAILS = ['coach@proactive.com', 'pilot@proactive.com'];
```

**Risk:** Anyone with repository access can authenticate without credentials.

**Remediation:** Move to environment variables, implement real backend authentication.

---

### CRITICAL-002: DOM-Based XSS in Node Names
**Location:** `app/src/App.tsx:14-19`, `app/src/components/GraphCanvas.tsx:64`

User input from `prompt()` is unsanitized and rendered directly:
```typescript
const name = prompt("Enter person's name:")  // No validation
addNode({ id, name, role: 'Peer' })  // Directly stored
.text((d) => d.name)  // Directly rendered in SVG
```

**Risk:** Malicious input can execute JavaScript, compromise sessions.

**Remediation:** Input validation, sanitization, and proper encoding.

---

### CRITICAL-003: Unvalidated Valence Score Ranges
**Location:** `app/src/components/ValenceEditor.tsx:60-68`

Client-side range constraints can be bypassed via DevTools or console manipulation.

**Risk:** Invalid data corruption, visualization failures.

**Remediation:** Server-side validation, store-level clamping.

---

## High-Priority Data Loss Risks

### RISK-001: Complete Session Loss on Browser Refresh
**Severity:** CRITICAL
**Likelihood:** HIGH

All data exists only in-memory (Zustand store). No persistence layer implemented.

**Impact:** Users lose all work on browser refresh, tab close, or crash.

**Mitigation Required:**
- Implement localStorage auto-save (every 500ms)
- Add "unsaved changes" warning before page unload
- Session recovery mechanism

---

### RISK-002: Export Functionality Missing Valence Data
**Severity:** CRITICAL
**Likelihood:** HIGH

Export includes nodes and links, but race conditions may cause valence data loss.

**Impact:** Exported sessions are incomplete, cannot fully restore.

**Mitigation Required:**
- Verify all store state is included in export
- Add export validation
- Test import/export round-trip

---

### RISK-003: No Import Functionality
**Severity:** CRITICAL
**Likelihood:** CRITICAL

`loadSession()` exists in store but no UI to import files.

**Impact:** Export feature is incomplete - users cannot restore their data.

**Mitigation Required:** Implement file import UI.

---

## Performance & Scalability Risks

### PERF-001: D3 Force Simulation Scales Poorly (O(n²))
**Severity:** CRITICAL
**Likelihood:** HIGH

Force simulation becomes unusable with 100+ nodes.

**Observed Performance:**
- 50 nodes: Acceptable (~30ms/tick)
- 100 nodes: Noticeable lag (~50ms/tick)
- 250+ nodes: Unusable (>200ms/tick)

**Mitigation Required:**
- Implement Barnes-Hut approximation
- Add virtualization for off-screen nodes
- Provide "static layout" mode without simulation

---

### PERF-002: Memory Leaks in useEffect Dependencies
**Severity:** HIGH
**Likelihood:** HIGH

Dependencies on callback functions and valence object cause unnecessary re-renders.

**Impact:** Performance degrades over time in long sessions.

**Mitigation Required:** Memoization, dependency optimization.

---

## Accessibility Violations

### A11Y-001: No Keyboard Navigation (WCAG 2.1 AA Violation)
**Severity:** HIGH
**Likelihood:** CRITICAL

SVG graph has no keyboard support - click-only interaction.

**Impact:** Unusable for keyboard-only users.

**Mitigation Required:** Implement Tab/Enter/Space navigation, ARIA labels.

---

### A11Y-002: Color-Only Valence Indicators (WCAG Violation)
**Severity:** HIGH
**Likelihood:** CRITICAL

Link colors (green/orange/red) are the only valence indicators.

**Impact:** Color-blind users cannot distinguish relationship health.

**Mitigation Required:** Add patterns, icons, or text labels.

---

## User Experience Issues

### UX-001: Prompt-Based "Add Person" Dialog
**Severity:** HIGH
**Likelihood:** CRITICAL

JavaScript `prompt()` is blocking, not accessible, mobile-hostile.

**Mitigation Required:** Replace with proper modal form.

---

### UX-002: Link Selection Impossible with 20+ Nodes
**Severity:** HIGH
**Likelihood:** HIGH

3px stroke width makes overlapping links nearly impossible to click.

**Mitigation Required:** Increase hit area, add hover feedback, keyboard selection.

---

### UX-003: No Edit/Delete Functionality
**Severity:** HIGH
**Likelihood:** CRITICAL

Can only add nodes/links, no way to remove or modify them.

**Mitigation Required:** Add delete buttons, edit modals, undo/redo.

---

## Additional Security Concerns

### SEC-002: No Input Validation on Notes Field
**Severity:** HIGH

Notes textarea accepts unlimited text without length limits.

**Risk:** Memory exhaustion, DoS via massive notes.

**Mitigation:** Enforce 5000 character limit.

---

### SEC-003: No Export File Integrity Protection
**Severity:** HIGH

Exported JSON has no signature or hash - can be tampered with offline.

**Risk:** Malicious data injection via modified exports.

**Mitigation:** Add HMAC signature, validate on import.

---

### SEC-004: Zustand State Globally Accessible
**Severity:** HIGH

Any script in page can call `useStore.setState()` to manipulate data.

**Risk:** XSS + state manipulation = complete compromise.

**Mitigation:** Encapsulate store, limit global exposure.

---

## Architecture & Maintainability Issues

1. **No error boundaries** - One error crashes entire app
2. **Supabase declared but unused** - Technical debt
3. **D3 + React impedance mismatch** - Difficult to maintain
4. **No logging or metrics** - Cannot debug production issues
5. **No rate limiting** - Spam prevention needed

---

## Testing Gaps

- No unit tests for store logic
- No integration tests for D3 visualization
- No accessibility testing
- No performance benchmarks
- No security testing (penetration tests)

---

## Compliance Concerns

### Data Protection
- No encryption of exported data (GDPR/HIPAA concern if PII)
- No access logging for audit trails
- No data retention policies

### Security Standards
- Does not follow OWASP Top 10 defense patterns
- Missing security headers (CSP)
- No authentication hardening

---

## Recommended Roadmap

### Phase 1 (Immediate - Before Production)
1. ✅ Fix data persistence (localStorage auto-save)
2. ✅ Add import functionality
3. ✅ Implement error boundaries
4. ✅ Add keyboard navigation
5. ✅ Fix export to include all valence data

### Phase 2 (Short-term - Security)
1. Replace mock auth with real backend
2. Add input validation and sanitization
3. Implement CSP headers
4. Add rate limiting

### Phase 3 (Medium-term - UX)
1. Replace prompt() with proper forms
2. Add edit/delete functionality
3. Improve link selection UX
4. Add undo/redo

### Phase 4 (Long-term - Scale)
1. Optimize D3 performance
2. Implement Supabase integration
3. Add real-time collaboration
4. Historical relationship tracking

---

## Current Prototype Limitations

✅ **What Works:**
- Basic relationship mapping (nodes + links)
- 5-dimension valence assessment
- Visual force-directed layout
- Session export (partial)

❌ **What Doesn't Work:**
- Data persistence (lost on refresh)
- Import functionality (missing)
- Edit/delete operations (missing)
- Security (multiple critical vulnerabilities)
- Accessibility (WCAG violations)
- Performance at scale (100+ nodes)

---

## Conclusion

This is a **functional proof-of-concept** that demonstrates the core value proposition. However, it has critical security vulnerabilities, data loss scenarios, and accessibility issues that prevent production deployment.

**Recommendation:** Treat as prototype. Implement Phase 1 fixes before any production use.

---

**Report Sources:**
- Red Team Security Analysis (2025-12-03)
- Black Hat Critical Risk Analysis (2025-12-03)
- Real browser testing with Chrome DevTools MCP

**Next Review:** After Phase 1 fixes are implemented
