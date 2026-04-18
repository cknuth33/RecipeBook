# Changelog

All notable changes to RecipeBook are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
Versions follow [Semantic Versioning](https://semver.org/).

---

## [Unreleased]

### Added
- `teststrategy.md` — high-level test strategy covering AUT scope, automation trade-offs, and metrics (API, feature, system, qualitative)
- `testplan.md` — detailed test plan with 39 test cases across unit (TC-UNIT), API integration (TC-API), and manual UI (TC-UI) categories
- `testreport.md` — test report documenting results of all 39 automated tests (39/39 passed), including per-test timing and suite-level notes
- `CHANGELOG.md` — this file; tracks all notable changes by version following Keep a Changelog format
- `backend/app.js` — Express app module extracted from `server.js` and exported for use in tests without binding a port
- `backend/app.test.js` — 18 automated API integration tests using `supertest`, covering all 6 endpoints across happy paths and error paths; each test resets in-memory state via `jest.resetModules()`
- `supertest` added as a dev dependency

### Changed
- `backend/server.js` — reduced to entry point only (`require('./app')` + `app.listen`); no functional change to runtime behavior
- `recipes.test.js` — expanded from 4 tests to 21, organized into `describe` blocks per function (`validateRecipe`, `createRecipe`, `addRecipe`, `updateRecipe`, `deleteRecipe`, `searchRecipes`)

### Fixed
- `recipes.js` — ID generation changed from `Date.now()` to `Date.now()-{counter}` to prevent duplicate IDs when multiple recipes are created within the same millisecond (caused `updateRecipe` and `deleteRecipe` tests to fail non-deterministically)

---

## [0.2.0] - 2026-04-04

### Changed
- Updated header title in `index.html`

---

## [0.1.0] - 2026-04-04

### Added
- Initial project: mock three-tier recipe manager
- `backend/server.js` — Express REST API with endpoints:
  - `POST /api/auth/login` — credential check against `db.json`
  - `GET /api/recipes` — list all recipes
  - `GET /api/recipes/:id` — get recipe by ID
  - `POST /api/recipes` — create recipe (name, ingredients, instructions required)
  - `PUT /api/recipes/:id` — update recipe by ID
  - `DELETE /api/recipes/:id` — delete recipe by ID
- `backend/db.json` — seeded data: one user (`admin`) and three recipes (Classic Pancakes, Grandma's Chili, Avocado Toast)
- `frontend/index.html`, `frontend/style.css` — static UI served by Express
- `recipes.js` — pure functions for recipe validation, creation, update, delete, and search
- `recipes.test.js` — initial Jest test suite (4 tests)
- `Dockerfile` — single-stage Node 20 Alpine image, exposes port 3000
