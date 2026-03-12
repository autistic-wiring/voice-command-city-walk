# GitHub Workflows

This directory contains GitHub Actions workflows for the Voice Command City Walk project.

## Workflows

### 1. CI (`ci.yml`)
**Triggers:** Push to `main`/`develop`, Pull requests to `main`

Runs on every push and PR:
- **Build Job:** Installs dependencies and builds the project with Vite
- **Lint Job:** Placeholder for ESLint (uncomment when ESLint is added)
- **Test Job:** Verifies build output exists (placeholder for future tests)

### 2. Deploy to GitHub Pages (`deploy.yml`)
**Triggers:** Push to `main`, Manual dispatch

Automatically deploys the built site to GitHub Pages:
- Builds the project with Vite
- Uploads `dist/` folder as a Pages artifact
- Deploys to GitHub Pages environment

**Setup required:**
1. Go to Settings → Pages
2. Set Source to "GitHub Actions"

### 2b. Deploy to Self-Hosted Server (`deploy-self-hosted.yml`)
**Triggers:** Push to `main`, Manual dispatch

Deploys to your own server using a self-hosted runner:
- Builds the project with Vite
- Downloads artifacts on self-hosted runner
- Deploys to your server

**Setup required:**
1. Configure a self-hosted runner for this repo
2. Update the deploy step with your actual deployment commands
3. Set `runs-on: self-hosted` to use your runner

### 3. Playwright Tests (`playwright.yml`)
**Triggers:** Push to `main`/`develop`, Pull requests to `main`, Manual dispatch

Runs end-to-end browser tests:
- Installs Playwright browsers
- Builds the project
- Runs tests across Chromium, Firefox, WebKit, and mobile viewports
- Uploads HTML report as artifact

### 4. Code Quality (`code-quality.yml`)
**Triggers:** Push to `main`/`develop`, Pull requests to `main`, Weekly schedule

Security and quality checks:
- **Dependency Check:** Runs `npm audit` for vulnerabilities
- **CodeQL Analysis:** GitHub's static analysis for JavaScript

## Required Secrets

None required for public repositories. For private repos with CodeQL, ensure `GITHUB_TOKEN` has appropriate permissions.

## Local Development

### Running Tests Locally

```bash
# Install Playwright browsers (first time only)
npx playwright install

# Run tests
npx playwright test

# Run tests in UI mode
npx playwright test --ui

# Run tests in headed mode (see browser)
npx playwright test --headed
```

### Viewing Test Reports

```bash
# After running tests, show HTML report
npx playwright show-report
```

## Adding New Workflows

When adding new workflows:
1. Use `workflow_dispatch` for manual triggers
2. Set appropriate permissions (least privilege)
3. Use `actions/setup-node@v4` with caching
4. Pin to specific versions for stability
