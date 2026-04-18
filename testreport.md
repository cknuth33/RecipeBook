# RecipeBook Test Report

**Date:** 2026-04-18
**Test runner:** Jest 30
**Command:** `npm test -- --verbose`
**Working directory:** `RecipeBook/`

## Summary

| | Count |
|---|---|
| Test suites | 2 |
| Tests passed | 39 |
| Tests failed | 0 |
| Total duration | ~3.1 s |

---

## Suite 1: Unit Tests — `recipes.test.js`

Tests the pure functions exported from `recipes.js` in isolation. No server or network involved.

### validateRecipe

| ID | Description | Result | Duration |
|---|---|---|---|
| TC-UNIT-01 | Fails when name is empty | PASS | 6 ms |
| TC-UNIT-02 | Fails when name is whitespace only | PASS | — |
| TC-UNIT-03 | Fails when ingredients is missing | PASS | 1 ms |
| TC-UNIT-04 | Fails when instructions is missing | PASS | — |
| TC-UNIT-05 | Fails when servings is not a positive number | PASS | — |
| TC-UNIT-06 | Passes with all required fields present | PASS | 1 ms |
| TC-UNIT-07 | Passes with optional servings as a positive number | PASS | — |

### createRecipe

| ID | Description | Result | Duration |
|---|---|---|---|
| TC-UNIT-08 | Returns an object with the expected fields | PASS | 3 ms |
| TC-UNIT-09 | Trims whitespace from name, ingredients, and instructions | PASS | 1 ms |
| TC-UNIT-10 | Defaults category to empty string when not provided | PASS | — |

### addRecipe

| ID | Description | Result | Duration |
|---|---|---|---|
| TC-UNIT-11 | Increases array length by 1 | PASS | 1 ms |
| TC-UNIT-12 | Does not mutate the original array | PASS | — |

### updateRecipe

| ID | Description | Result | Duration |
|---|---|---|---|
| TC-UNIT-13 | Updates the correct recipe by id | PASS | — |
| TC-UNIT-14 | Leaves other recipes unchanged | PASS | 1 ms |
| TC-UNIT-15 | Does not mutate the original array | PASS | — |

### deleteRecipe

| ID | Description | Result | Duration |
|---|---|---|---|
| TC-UNIT-16 | Removes the correct recipe by id | PASS | — |
| TC-UNIT-17 | Does not remove unrelated recipes | PASS | 1 ms |

### searchRecipes

| ID | Description | Result | Duration |
|---|---|---|---|
| TC-UNIT-18 | Is case-insensitive | PASS | — |
| TC-UNIT-19 | Matches by ingredient | PASS | 1 ms |
| TC-UNIT-20 | Returns empty array when no recipes match | PASS | — |
| TC-UNIT-21 | Returns all recipes when query is empty | PASS | — |

**Suite result: 21 / 21 passed**

---

## Suite 2: API Integration Tests — `backend/app.test.js`

Tests the Express app via HTTP using `supertest`. Each test resets in-memory state to the seeded `db.json` data via `jest.resetModules()` in `beforeEach`.

### POST /api/auth/login

| ID | Description | Result | Duration |
|---|---|---|---|
| TC-API-01 | Returns 200 and success with valid credentials | PASS | 329 ms |
| TC-API-02 | Returns 401 with wrong password | PASS | 72 ms |
| TC-API-03 | Returns 401 with unknown username | PASS | 77 ms |
| TC-API-04 | Returns 401 when body is empty | PASS | 64 ms |

### GET /api/recipes

| ID | Description | Result | Duration |
|---|---|---|---|
| TC-API-05 | Returns 200 and an array of recipes | PASS | 65 ms |
| TC-API-06 | Returns all seeded recipes on a fresh start | PASS | 76 ms |

### GET /api/recipes/:id

| ID | Description | Result | Duration |
|---|---|---|---|
| TC-API-07 | Returns 200 and the recipe for a valid id | PASS | 62 ms |
| TC-API-08 | Returns 404 for an unknown id | PASS | 60 ms |

### POST /api/recipes

| ID | Description | Result | Duration |
|---|---|---|---|
| TC-API-09 | Creates a recipe with all fields and returns 201 | PASS | 65 ms |
| TC-API-10 | Creates a recipe with only required fields and returns 201 | PASS | 64 ms |
| TC-API-11 | Returns 400 when name is missing | PASS | 63 ms |
| TC-API-12 | Returns 400 when ingredients is missing | PASS | 69 ms |
| TC-API-13 | Returns 400 when instructions is missing | PASS | 63 ms |

### PUT /api/recipes/:id

| ID | Description | Result | Duration |
|---|---|---|---|
| TC-API-14 | Updates an existing recipe and returns 200 | PASS | 64 ms |
| TC-API-15 | Returns 404 when updating a non-existent recipe | PASS | 72 ms |

### DELETE /api/recipes/:id

| ID | Description | Result | Duration |
|---|---|---|---|
| TC-API-16 | Deletes an existing recipe and returns 200 | PASS | 65 ms |
| TC-API-17 | Recipe is no longer returned after deletion | PASS | 78 ms |
| TC-API-18 | Returns 404 when deleting a non-existent recipe | PASS | 60 ms |

**Suite result: 18 / 18 passed**

---

## Notes

- TC-API-01 has a higher duration (329 ms) on first run due to module load and supertest setup; subsequent tests in the suite run in the 60–80 ms range.
- All in-memory state is isolated per test via `jest.resetModules()` — no test depends on the outcome of another.
- Manual / UI tests (TC-UI-01 through TC-UI-05) are not included here as they require a running browser session and human observation. See `testplan.md` for execution steps.
