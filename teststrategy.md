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

> Detailed usability-testing protocol: see [usabilitytestplan.md](usabilitytestplan.md).
---

## Summary

| Test Type | Tool | Coverage |
|---|---|---|
| Unit tests | Jest | Recipe data logic (`recipes.js`) |
| API integration tests | Jest + supertest | All 6 endpoints, happy and error paths |
| End-to-end UI tests | Playwright (chromium) | Home-cook golden path in a real browser |
| Manual / exploratory | Browser | Cross-browser visual, responsive, accessibility |
| Performance (basic) | Jest timing | Per-endpoint response time checks |

---

## Golden Path Analysis

Functional and unit tests verify that endpoints behave; they say nothing about whether a 
user can actually finish a task. Golden paths are the highest-value end-to-end journeys — 
the flows where a regression would be most damaging and most quickly noticed. Identifying 
them is a prioritisation exercise: with a finite automation budget, which two or three flows 
do we never want to ship broken?

The two personas in [usabilitytestplan.md](usabilitytestplan.md) — the **home cook** 
(primary) and the **casual browser** (secondary) — bound the user base. Mapping their 
typical journeys against the eight scenarios in that plan (TC-USE-01 through TC-USE-08) 
yields two candidate golden paths.

### Path A — Home cook (primary persona)

> Log in, add a family recipe, find it later mid-cooking, tweak it, eventually remove it.

**Scenario coverage:** TC-USE-01 (login) → TC-USE-04 (add) → TC-USE-02 (search) → 
TC-USE-03 (expand/read) → TC-USE-06 (edit) → TC-USE-07 (delete) → TC-USE-08 (logout).

**Why it matters:**
- Exercises every CRUD verb in the public API (`POST`, `GET`, `PUT`, `DELETE`) plus auth.
- Touches every dynamic UI region — modal, list, search filter, status banner, confirm 
dialog.
- A failure anywhere in this path blocks the primary persona from their primary purpose. 
There is no degraded fallback.
- Most regressions a developer would introduce in `frontend/app.js` or `backend/server.js` 
will surface on this path.

### Path B — Casual browser (secondary persona)

> Log in, find a recipe someone else added, read it, log out.

**Scenario coverage:** TC-USE-01 (login) → TC-USE-02 (search) → TC-USE-03 (expand/read) → 
TC-USE-08 (logout).

**Why it matters:**
- Represents the higher-frequency, lower-effort journey — the majority of household use 
sessions.
- Read-only: a regression here is a "can't even look at the recipe" failure, which damages 
trust faster than a mutation bug.
- Validates the rendering, search filter, and card-expand affordance independently of any 
write traffic.

### Which path is automated first

**Path A (home cook) is the e2e automation choice.** Path B is a strict subset — login, list 
render, search, expand, and logout all live inside Path A. Any breakage that would show up 
on Path B will also show up on Path A, so automating the home-cook path delivers the broader 
regression net for the same one-spec budget.

Path B remains a candidate for a second e2e spec later (cheap to add, narrowly read-only, 
useful as a smoke test in environments where mutation tests are undesirable). But the rubric 
for "what do we automate first?" is *maximum coverage per spec, anchored to the primary 
persona* — and that is Path A.

The realised spec lives in `e2e/home-cook.spec.js` and is run via `npm run test:e2e` in the 
Playwright project configured at `playwright.config.js`.
