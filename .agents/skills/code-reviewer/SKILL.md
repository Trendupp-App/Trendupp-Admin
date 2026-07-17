---
name: code-reviewer
description: Automatically reviews TypeScript/React code changes, checks type safety, runs ESLint, verifies tests, and identifies potential bugs or optimizations before staging and pushing.
---

# Code Reviewer Skill Guidelines

This skill defines the workflow and criteria for running automated code reviews on `Trendupp-Admin` (TypeScript, React 19, Next.js 16).

---

## Code Review Workflow

Every time the user requests a code review or before staging and pushing changes, the assistant must follow this 4-step pipeline:

### 1. Static Analysis & Type Checking
- Run ESLint to check for code style guidelines and linter compliance:
  ```bash
  npx eslint .
  ```
- Run TypeScript compiler to ensure complete type safety and verify that no hidden compilation errors exist:
  ```bash
  npx tsc --noEmit
  ```

### 2. Code Quality Checklist
Review the modified files to check if they satisfy:
- **Type Safety**:
  - Zero explicit or implicit `any` usage.
  - Use of optional chaining (`?.`) when referencing nested properties of optional objects.
- **React Best Practices**:
  - No synchronous `setState` calls directly inside a `useEffect` loop (prevents cascading rerenders).
  - All dependency arrays in `useEffect`, `useMemo`, and `useCallback` are complete.
  - Interactive elements have unique `id` attributes for testing and accessibility.
- **Next.js & Performance**:
  - Image assets should be properly handled (avoiding static optimization warnings or disabling them via explicit rule disables where appropriate).
  - All pages and layouts must have `"use client";` correctly declared if they use browser hooks or state.

### 3. Automated Test Verification
- Run Playwright E2E tests to verify that changes did not break core user flows under mock conditions:
  ```bash
  npx playwright test --project=chromium
  ```

### 4. Code Review Output
Provide the results of the review structured as follows:
- **Status Summary**: Compile check results, lint results, and test suite pass rate.
- **Optimization Opportunities**: Recommendations for simplifying logic, improving performance, or enhancing type safety.
