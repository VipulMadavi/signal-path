# Phase 11: Production Hardening & Score Optimization

## Goal
Close the 6 identified gaps from the audit to move the project from an A- to an A+ level.

---

## 1. Automated Testing (Engineering Rigor) 🧪
*   **Action**: Install `vitest` and `@testing-library/react`.
*   **Tests to Write**:
    *   `src/lib/__tests__/scoring.test.ts`: Verify weighted sums and explanation generation.
    *   `src/lib/__tests__/enrichment.test.ts`: Verify `validateUrl` (SSRF blocks) and `extractTextFromHtml`.
*   **Value**: Proves code reliability and sophisticated engineering.

## 2. Accessibility (A11y/Lighthouse) ♿
*   **Action**: Pass `aria-label` to all interactive elements lacking text.
*   **Target Components**:
    *   `TopBar.tsx`: Settings, Notifications, Workspace, Avatar, Model Switcher.
    *   `Sidebar.tsx`: Collapse toggle, Hamburger menu, Nav icons.
    *   `Pagination.tsx`: Previous/Next arrows.
    *   `CompaniesTable.tsx`: Filter icons, Export/Enrich buttons.
*   **Value**: Ensures Accessibility score ≥ 90 in Lighthouse.

## 3. Lint & Code Health 🧹
*   **Action**: Run `npm run lint` and resolve all remaining warnings.
*   **Common Fixes**: 
    *   Prefix unused variables with `_` (e.g. `_totalScore`).
    *   Wrap `setState` calls in `useEffect` with proper dependencies.
    *   Remove unused imports.
*   **Value**: Professional "zero warning" console output.

## 4. PRD Completion 📑
*   **Action**: Add a "New Company" button in `CompaniesHeader.tsx` that opens a simple modal.
*   **Logic**: Allow user to add a company (ID, Name, URL, Sector, Stage) which persists to a `userCompanies` array in `useCompanyStore.ts`.
*   **Value**: Marks the core product requirement "Add Company" as 100% complete.

## 5. Documentation Cleanup 📁
*   **Action**: Delete `f:/SEM6/test- VC app/implementation_plan.md` (root).
*   **Logic**: Keep only the one inside `/docs` to avoid confusion.
*   **Value**: Professional repo structure.

---

## Final Verification
1.  `npm run build`
2.  `npm run test`
3.  Formal Lighthouse Audit via Chrome DevTools.
4.  Update `README.md` with final score badges.
