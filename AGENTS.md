Zircon is a personal assistant app.

## General
- After each message, check if there are decissions which are worth adding to AGENTS.md and suggest them to the user.
- ALWAYS implement a minimal solution which fullfills the requirements, come up with ideas how to improve the solution, and ask the user if they want to implement any of those improvements.

## Code style
- Internal libraries and plugins should add external runtime libraries to `peerDependencies`.
- Prefer guard clauses: check error and invalid cases first, throw or return early, then keep the valid happy-path result as the final return.

## Validation
- ALWAYS run `turbo ci --output-logs=errors-only` on root directory after every code change
- Validate changes that could affect the frontend using the browser and affect the backend using curl before finishing the task.
