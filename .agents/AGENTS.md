# Workspace Rules and Guidelines - Trendupp Web

These rules must be followed without exception by all AI coding assistants pair programming on this repository.

---

## 1. Git & GitHub Branch Workflow Rules

> [!IMPORTANT]
> To prevent branch confusion and messy PR history, follow these strict branch guidelines:

- **Primary Integration Branch:** The primary branch for all admin dashboard, explore, and profile features is **`feature/admin-dashboard`**.
- **Pushes & PRs:** All pushes to the remote repository and pull requests (PRs) must be made from the **`feature/admin-dashboard`** branch targeting **`develop`**. Never push or create pull requests from temporary feature branches directly to the remote repository.
- **Temporary Branch Flow:**
  - If working on a separate sub-task (e.g., `feature/profile-integration`), complete the work on that local branch.
  - Once the feature is complete and verified, **checkout `feature/admin-dashboard` and merge the sub-task branch into it**.
  - Perform final verification checks on `feature/admin-dashboard` and push it to the remote repository.

---

## 2. Commit Quality & Pre-Commit Pipelines

> [!WARNING]
> Staging, committing, or pushing code that breaks type checks, eslint, or pre-commit hooks is unacceptable.

- **Linting & Code Style:**
  - Avoid using `any` (explicit or implicit) as the pre-commit ESLint configuration blocks it. Use specific types, interfaces, or generics.
  - Remove unused imports and unused variables (or prefix them appropriately if required) to avoid ESLint warnings that fail the Husky pre-commit hooks.
  - Ensure all code matches the project's Prettier styling rules.
- **Type Safety:**
  - Run type checking using `npx tsc --noEmit` before staging or committing any code.
- **Automated Testing:**
  - Run Playwright E2E tests (`npx playwright test --project=chromium`) to verify that the application loads and runs correctly under mocked conditions.
- **GitHub Copilot Code Review:**
  - Perform a GitHub Copilot code review on all code changes before merging, creating a Pull Request (PR), or pushing code to the remote repository.
- **API UI Integration:**
  - Always update and bind the user interface immediately after implementing new API integrations to ensure features are fully functional on the frontend.

---

## 3. Communication & Planning

- **Planning Mode:**
  - For non-trivial modifications, outline the proposed files, API changes, and verification scripts in the `implementation_plan.md` artifact, and wait for explicit user approval before execution.
  - Document all completed changes, E2E validation results, and UI transitions in `walkthrough.md` after completion.

---

## 4. Code Architecture & DRY Guidelines

- **Short & Dry Code:**
  - Write short, DRY, modular code. Avoid creating long files or components.
  - Keep all code blocks, components, and files within 500 to 600 characters wherever possible.
  - Proactively refactor complex files and layouts into smaller, self-contained sub-components and custom hooks to keep codebase clean and maintainable.
