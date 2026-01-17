# Contributing to UNSENT

## Workflow Rules for 24h Hackathon

### 1. The Golden Rule
**NEVER COMMIT DIRECTLY TO MAIN.**
The `main` branch is for production-ready code only.

### 2. Branching Strategy
- **Source**: Always branch from `develop`.
- **Naming**: Use `feature/<feature-name>` (e.g., `feature/star-map`, `feature/auth-api`).
- **Merging**: Pull Requests (PRs) must target `develop`.

### 3. Commit Convention
We follow conventional commits to keep history clean:
- `feat: ...` for new features
- `fix: ...` for bug fixes
- `chore: ...` for maintenance/config (like this scaffold)
- `docs: ...` for documentation

### 4. Local Testing
Before creating a PR:
1.  Ensure the frontend builds: `npm run build` (once setup)
2.  Ensure backend starts without errors.
3.  Lint your code if linters are configured.

### 5. Deployment
- Merges to `develop` will trigger staging deployment (autodeploy).
- Merges to `main` will trigger production deployment.
