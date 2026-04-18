# RecipeBook Test Strategy

## Area Under Test (AUT)

RecipeBook is a household recipe manager built as a mock three-tier architecture: a Node.js/Express backend API, a JSON file-based data layer, and a static HTML/CSS frontend. The application supports user authentication and full CRUD operations on recipes.

The scope of testing covers:

- **Authentication** — login with valid/invalid credentials via `POST /api/auth/login`
- **Recipe management** — creating, reading, updating, and deleting recipes via the REST API
- **Input validation** — required field enforcement on recipe create/update
- **Frontend UI** — user-facing interactions (viewing recipe list, submitting forms, error states)

Out of scope: user registration, persistent storage (data resets on server restart by design), and multi-user session management.

---

## General Processes

Testing will combine **manual exploratory testing** for the frontend UI and **automated unit/integration tests** for the backend API using Jest (already configured in `package.json`).

Automation is applied where tests are:
- **Repeatable** — same inputs must always produce the same outputs (e.g., API response codes and shapes)
- **Specification-driven** — behavior is clearly defined by the API contracts in `server.js`

Manual testing is used where automation is weak — adapting to visual layout changes, verifying UX flow, and exploratory edge cases.

---

## Automation: Strengths and Weaknesses

| | Notes for RecipeBook |
|---|---|
| **Strength: Exact steps** | API endpoints have clear, deterministic inputs and outputs — ideal for automation |
| **Strength: Specific validation** | Response bodies (e.g., `{ success: true, recipe: {...} }`) and status codes (200, 201, 400, 401, 404) can be asserted precisely |
| **Strength: Repeatable** | In-memory data resets on server start, making test state predictable |
| **Weakness: Restrictive** | Automated tests will not catch UI regressions (layout shifts, broken CSS, missing frontend wiring) |
| **Weakness: Doesn't adapt** | If the API response shape changes, all assertions against that shape will break and require updates |

---

## Metrics

### API Performance Metrics
- **Response time per endpoint** — how long does each API call take to return? (target: < 100ms for all CRUD operations on the in-memory dataset)
- **Can be tied into Jest tests** using `Date.now()` before/after fetch calls or a timing wrapper

### Feature Performance Metrics
- **Time to load recipe list** — how long from page load until recipes are visible to the user?
- **Time to submit a new recipe** — how long from form submit until the new recipe appears in the list?

### System Performance Metrics
- **Uptime** — is the Express server stable under normal usage?
- **Behavior under repeated requests** — does the in-memory store remain consistent after many creates/deletes in sequence?
- **Spike behavior** — not a primary concern for a household app, but worth noting that the in-memory store has no concurrency protection

### Qualitative Metrics
- **Product usage** — who uses it and for what? (household members browsing vs. adding recipes)
- **Product health** — are there errors users regularly hit (e.g., 404s on missing recipes, validation rejections)?
- **Customer satisfaction** — is the UI intuitive enough that a user can add and find a recipe without confusion?

These qualitative metrics are best gathered through **direct user observation** or informal feedback sessions, since there is no analytics or logging infrastructure currently in place.

---

## Summary

| Test Type | Tool | Coverage |
|---|---|---|
| Unit tests | Jest | Recipe data logic (`recipes.js`) |
| API integration tests | Jest + supertest | All 6 endpoints, happy and error paths |
| Manual / exploratory | Browser | Frontend UI, form flows, visual correctness |
| Performance (basic) | Jest timing | Per-endpoint response time checks |
