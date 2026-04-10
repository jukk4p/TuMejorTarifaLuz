# Skill Registry

## User Skills
- **branch-pr**: PR creation workflow. Trigger: Creating pull requests.
- **go-testing**: Go testing patterns. Trigger: Writing Go tests.
- **issue-creation**: GitHub issue creation. Trigger: Creating issues.
- **judgment-day**: Parallel adversarial review. Trigger: "judgment day", "review adversarial".
- **skill-creator**: Creates new agent skills. Trigger: Creating new skills.

## Project Standards (auto-resolved)
- No project-specific skill conventions found.

## Testing Strategy
- Unit/Integration/E2E: Not available. Pre-deployment manual testing required.
- Quality: ESLint + Prettier + TSC.

## Architecture
- Next.js 16/React 19 (App Router).
- Firebase Firestore (Auth, Notifications, Data Snapshots).
- Shared components in `src/components/ui`.
- Global styles in `src/app/globals.css`.
- Config in `next.config.ts`.
