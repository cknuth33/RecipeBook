# RecipeBook Test Plan

Derived from: [teststrategy.md](teststrategy.md)

This plan defines the specific test cases for each area identified in the test strategy. Each case includes setup, execution steps, and what constitutes a pass or fail.

**Automated test files:**
- `RecipeBook/recipes.test.js` — unit tests (TC-UNIT-*)
- `RecipeBook/backend/app.test.js` — API integration tests (TC-API-*)

Run all tests: `npm test` from the `RecipeBook/` directory.

---

## Feature 1: Authentication (`POST /api/auth/login`)

### TC-API-01: Login with valid credentials
- **Setup:** Server running with default `db.json` (username: `admin`, password: `password123`)
- **Steps:** Send `POST /api/auth/login` with body `{ "username": "admin", "password": "password123" }`
- **Validate:** Status `200`, `body.success === true`, `body.username === "admin"`

### TC-API-02: Login with wrong password
- **Setup:** Default `db.json`
- **Steps:** Send `POST /api/auth/login` with body `{ "username": "admin", "password": "wrong" }`
- **Validate:** Status `401`, `body.success === false`

### TC-API-03: Login with unknown username
- **Setup:** Default `db.json`
- **Steps:** Send `POST /api/auth/login` with body `{ "username": "nobody", "password": "password123" }`
- **Validate:** Status `401`, `body.success === false`

### TC-API-04: Login with empty body
- **Setup:** Default `db.json`
- **Steps:** Send `POST /api/auth/login` with empty body `{}`
- **Validate:** Status `401`, `body.success === false`

---

## Feature 2: List Recipes (`GET /api/recipes`)

### TC-API-05: Returns all recipes
- **Setup:** Default `db.json` (3 seeded recipes)
- **Steps:** Send `GET /api/recipes`
- **Validate:** Status `200`, `body.success === true`, `body.recipes` is an array

### TC-API-06: Returns correct count on fresh start
- **Setup:** Default `db.json`
- **Steps:** Send `GET /api/recipes` without any prior mutations
- **Validate:** `body.recipes.length === 3`

---

## Feature 3: Get Recipe by ID (`GET /api/recipes/:id`)

### TC-API-07: Returns recipe for valid ID
- **Setup:** Default `db.json`
- **Steps:** Send `GET /api/recipes/1`
- **Validate:** Status `200`, `body.success === true`, `body.recipe.id === "1"`

### TC-API-08: Returns 404 for unknown ID
- **Setup:** Default `db.json`
- **Steps:** Send `GET /api/recipes/999`
- **Validate:** Status `404`, `body.success === false`

---

## Feature 4: Create Recipe (`POST /api/recipes`)

### TC-API-09: Creates recipe with all fields
- **Setup:** Default `db.json`
- **Steps:** Send `POST /api/recipes` with body `{ "name": "Soup", "category": "Dinner", "servings": 4, "ingredients": "water, vegetables", "instructions": "boil everything" }`
- **Validate:** Status `201`, `body.success === true`, `body.recipe.name === "Soup"`, `body.recipe.id` is defined

### TC-API-10: Creates recipe with only required fields
- **Setup:** Default `db.json`
- **Steps:** Send `POST /api/recipes` with body `{ "name": "Soup", "ingredients": "water", "instructions": "boil" }`
- **Validate:** Status `201`, `body.success === true`

### TC-API-11: Rejects when name is missing
- **Setup:** Default `db.json`
- **Steps:** Send `POST /api/recipes` with body `{ "ingredients": "water", "instructions": "boil" }`
- **Validate:** Status `400`, `body.success === false`

### TC-API-12: Rejects when ingredients is missing
- **Setup:** Default `db.json`
- **Steps:** Send `POST /api/recipes` with body `{ "name": "Soup", "instructions": "boil" }`
- **Validate:** Status `400`, `body.success === false`

### TC-API-13: Rejects when instructions is missing
- **Setup:** Default `db.json`
- **Steps:** Send `POST /api/recipes` with body `{ "name": "Soup", "ingredients": "water" }`
- **Validate:** Status `400`, `body.success === false`

---

## Feature 5: Update Recipe (`PUT /api/recipes/:id`)

### TC-API-14: Updates an existing recipe
- **Setup:** Default `db.json`
- **Steps:** Send `PUT /api/recipes/1` with body `{ "name": "Updated Pancakes" }`
- **Validate:** Status `200`, `body.success === true`, `body.recipe.name === "Updated Pancakes"`

### TC-API-15: Returns 404 for unknown ID
- **Setup:** Default `db.json`
- **Steps:** Send `PUT /api/recipes/999` with body `{ "name": "Ghost" }`
- **Validate:** Status `404`, `body.success === false`

---

## Feature 6: Delete Recipe (`DELETE /api/recipes/:id`)

### TC-API-16: Deletes an existing recipe
- **Setup:** Default `db.json`
- **Steps:** Send `DELETE /api/recipes/1`
- **Validate:** Status `200`, `body.success === true`

### TC-API-17: Deleted recipe no longer returned
- **Setup:** Default `db.json`
- **Steps:** (1) Send `DELETE /api/recipes/1`, then (2) send `GET /api/recipes/1`
- **Validate:** Step 2 returns status `404`

### TC-API-18: Returns 404 when deleting non-existent recipe
- **Setup:** Default `db.json`
- **Steps:** Send `DELETE /api/recipes/999`
- **Validate:** Status `404`, `body.success === false`

---

## Unit Tests — Recipe Logic (`recipes.js`)

### validateRecipe

| ID | Description | Input | Expected |
|---|---|---|---|
| TC-UNIT-01 | Fails when name is empty | name: "" | valid: false, errors includes "name" |
| TC-UNIT-02 | Fails when name is whitespace only | name: "   " | valid: false, errors includes "name" |
| TC-UNIT-03 | Fails when ingredients is missing | ingredients: "" | valid: false, errors includes "ingredients" |
| TC-UNIT-04 | Fails when instructions is missing | instructions: "" | valid: false, errors includes "instructions" |
| TC-UNIT-05 | Fails when servings is 0 or negative | servings: 0 | valid: false, errors includes "servings" |
| TC-UNIT-06 | Passes with all required fields | all fields present | valid: true, errors.length === 0 |
| TC-UNIT-07 | Passes with valid optional servings | servings: 2 | valid: true |

### createRecipe

| ID | Description | Expected |
|---|---|---|
| TC-UNIT-08 | Returns object with all expected fields | has id, name, ingredients, instructions, createdAt |
| TC-UNIT-09 | Trims whitespace from text fields | name, ingredients, instructions are trimmed |
| TC-UNIT-10 | Defaults category to empty string | category === "" when not provided |

### addRecipe

| ID | Description | Expected |
|---|---|---|
| TC-UNIT-11 | Increases array length by 1 | after.length === 1 |
| TC-UNIT-12 | Does not mutate original array | original array length unchanged |

### updateRecipe

| ID | Description | Expected |
|---|---|---|
| TC-UNIT-13 | Updates the correct recipe by id | updated recipe has new name |
| TC-UNIT-14 | Leaves other recipes unchanged | sibling recipe is unmodified |
| TC-UNIT-15 | Does not mutate original array | original array entry unchanged |

### deleteRecipe

| ID | Description | Expected |
|---|---|---|
| TC-UNIT-16 | Removes the correct recipe by id | array length decreases by 1 |
| TC-UNIT-17 | Does not remove unrelated recipes | only target recipe is removed |

### searchRecipes

| ID | Description | Expected |
|---|---|---|
| TC-UNIT-18 | Case-insensitive name match | "pancakes" and "PANCAKES" both return 1 result |
| TC-UNIT-19 | Matches by ingredient | query on ingredient name returns matching recipe |
| TC-UNIT-20 | Returns empty array when no match | "xyz" returns [] |
| TC-UNIT-21 | Empty query returns all recipes | "" returns full list |

---

## Manual Tests — Frontend UI

These tests are executed by a human in a browser at `http://localhost:3000`. They are not automated because they verify visual rendering and user-facing interactions.

**Prerequisite for all UI tests:** Server is running (`npm start` or `docker run`).

### TC-UI-01: Recipe list loads on page open
- **Setup:** Server running
- **Steps:** Open `http://localhost:3000` in a browser
- **Validate:** The 3 seeded recipes (Classic Pancakes, Grandma's Chili, Avocado Toast) are visible

### TC-UI-02: Add recipe form submits successfully
- **Setup:** Server running
- **Steps:** (1) Fill in name, ingredients, and instructions fields; (2) click Submit
- **Validate:** New recipe appears in the list without a full page reload

### TC-UI-03: Form rejects submission with missing required fields
- **Setup:** Server running
- **Steps:** Leave the name field blank; click Submit
- **Validate:** An error or validation message is shown; no new recipe is added to the list

### TC-UI-04: Recipe detail view shows correct content
- **Setup:** Server running
- **Steps:** Click on a recipe in the list
- **Validate:** The detail view displays the correct name, ingredients, and instructions for that recipe

### TC-UI-05: Delete a recipe from the UI
- **Setup:** Server running
- **Steps:** Click the delete action on a recipe
- **Validate:** The recipe is removed from the list
