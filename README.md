# RecipeBook. 

A household recipe manager built as a three-tier web application. Store, browse, edit, and search your recipes through a clean browser interface backed by a REST API.

## Features

- **User authentication** — login-gated access to the recipe collection
- **Full CRUD** — create, view, edit, and delete recipes
- **Real-time search** — filter recipes by name, ingredient, or category as you type
- **Validation** — input is checked on both the client and server

Default credentials: `admin` / `password123`

> **Note:** Recipe changes are held in memory and reset when the server restarts.

## Getting Started

```bash
npm install
npm start        # starts the server on port 3000
npm test         # runs all 39 automated tests
```

or using Docker:
```bash
docker build -t recipebook .
docker run -p 3000:3000 recipebook
```

## Architecture

RecipeBook is organized into three layers.

### 1. Presentation — `frontend/`

Static HTML, CSS, and vanilla JavaScript served directly by Express.

- `index.html` — page structure: login form, recipe list, add/edit modal
- `app.js` — all client logic: API calls, form handling, rendering, XSS escaping
- `style.css` — vintage monospace design built with CSS variables and IBM Plex Mono / Playfair Display fonts

### 2. Application (API) — `backend/`

An Express server that exposes six REST endpoints and manages the in-memory recipe store.

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/login` | Authenticate a user |
| GET | `/api/recipes` | List all recipes |
| GET | `/api/recipes/:id` | Get a single recipe |
| POST | `/api/recipes` | Create a recipe |
| PUT | `/api/recipes/:id` | Update a recipe |
| DELETE | `/api/recipes/:id` | Delete a recipe |

All responses share a consistent shape: `{ success, message?, recipe?, recipes? }`.

Seed data (3 recipes, 1 user) lives in `backend/db.json` and is loaded into memory on startup.

### 3. Business Logic — `recipes.js`

Pure, framework-independent utility functions used by the API layer.

| Function | Purpose |
|----------|---------|
| `validateRecipe(recipe)` | Checks required fields and value constraints |
| `createRecipe(fields)` | Builds a new recipe object with a generated ID and timestamp |
| `addRecipe(recipes, recipe)` | Returns a new array with the recipe appended |
| `updateRecipe(recipes, id, fields)` | Returns a new array with the matching recipe updated |
| `deleteRecipe(recipes, id)` | Returns a new array with the matching recipe removed |
| `searchRecipes(recipes, query)` | Case-insensitive filter across name, ingredients, and category |

All functions are immutable — they return new arrays rather than mutating state.

## Testing

| File | Tests | Scope |
|------|-------|-------|
| `recipes.test.js` | 21 | Unit tests (pure functions) |
| `backend/app.test.js` | 18 | API integration tests (supertest) |

CI runs `npm test` automatically on every push and pull request via GitHub Actions.
