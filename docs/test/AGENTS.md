James is a personal assistant app.

## General
- After each task, check if there are decissions which are worth adding to AGENTS.md and suggest them to the user.

## Development
- **ALWAYS** run `turbo ci --output-logs=errors-only` on root directory after every code change to ensure that init, build, check, lint and tests pass for all projects. 
- Use already running dev processes instead of starting new ones (when available).
- Validate changes that could affect the frontend using the browser before finishing the task.
