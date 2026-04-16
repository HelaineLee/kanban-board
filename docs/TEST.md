## Test Code Rules

- Test commands live in `docs/BUILD.md`; use `npm test` for the Vitest suite.
- Automated tests live under `tests/` and should mirror the feature or shared module they cover, such as `tests/features/board` or `tests/lib`.
- When a feature is added or existing behavior changes, update or add the corresponding test code in the same change.
- If a feature cannot be covered with an automated test yet, leave a short note in the PR or task explaining the gap and the intended follow-up coverage.