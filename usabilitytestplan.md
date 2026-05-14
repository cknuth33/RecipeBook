# RecipeBook Usability Test Plan

Related: [teststrategy.md](teststrategy.md) · [testplan.md](testplan.md)

This document describes how to evaluate RecipeBook with real users. The functional test suite (39 automated tests + 5 manual UI cases) verifies that the code works; this plan verifies that a user can actually use it.

---

## 1. Overview & Objectives

**Area Under Test (AUT):** the served frontend at `http://localhost:3000` — login, recipe list, search, add/edit modal, delete confirmation, logout. The backend is treated as a black box (already covered by TC-API-* in `testplan.md`).

The plan evaluates usability against the three classic dimensions:

| Dimension | Question it answers |
|---|---|
| **Effectiveness** | Can the user complete the task at all? |
| **Efficiency** | How quickly, with how few errors? |
| **Satisfaction** | Did the experience feel pleasant and trustworthy? |

A session is considered successful if it produces enough signal across these three dimensions to recommend at least one concrete UI change (or, equivalently, to confirm that an area needs no change).

---

## 2. Research Questions

The test should produce evidence-based answers to:

1. Can a first-time user log in and find a specific recipe within 60 seconds?
2. Do users discover the **+ add recipe** affordance without prompting?
3. Are the inline validation messages (`err-name`, `err-ingredients`, `err-instructions` in `frontend/index.html`) understood, and do users know how to recover from them?
4. Is the recipe card's click-to-expand behavior discoverable, or do users assume the cards are static?
5. Is **log out** findable when the user wants to hand the device to someone else?
6. Does the modal-based add/edit flow feel natural, or do users expect a dedicated page?
7. Does real-time search feedback help or confuse?

---

## 3. Personas

Two lightweight personas to guide recruitment and task wording:

**Home cook (primary).** Adds family recipes, searches for a recipe mid-cooking, edits a recipe over time as it evolves. Comfortable with browsers; not a power user. Frequently interrupted (oven timer, kids, hands wet) — values quick scanning over deep navigation.

**Casual browser (secondary).** Opens the app to read a recipe that someone else in the household added. Mostly read-only. Rarely adds or edits, so any "advanced" controls must not interfere with the read path.

Personas inform two things: (a) recruitment criteria (mix of cooks and non-cooks), and (b) task wording (kitchen context, not desk context).

---

## 4. Method

### Primary: Moderated, remote, think-aloud sessions

- **Participants:** five primary, one pilot (see section 5).
- **Format:** 30-minute remote session over screen share.
- **Style:** moderator reads each task aloud, asks the participant to "think out loud" while working, intervenes only when the participant is fully stuck or asks for help.

Five is the standard recruitment target for moderated usability testing — Nielsen's well-known finding is that ~85% of issues surface with the first five users, after which returns diminish sharply. Think-aloud is chosen because it exposes the participant's reasoning, not just their behaviour, which is what we need to answer the research questions in section 2.

### Supplement: Guerrilla pass on the entry path

A short, low-effort guerrilla pass on **TC-USE-01** (login) and **TC-USE-02** (search) with 2–3 ad-hoc users. Login is the gatekeeper to every other journey and is the cheapest journey to de-risk early.

### Explicitly de-scoped

| Method | Why not |
|---|---|
| A/B testing | No variants to compare. |
| Comparative | No competitor build inside this repo to compare against. |
| Formal usability lab | Overkill for a household app; cost outweighs incremental signal. |
| Unmoderated remote | Would miss the think-aloud signal that's most valuable here. |

---

## 5. Participants & Recruiting

- **Sample size:** 5 primary participants + 1 pilot.
- **Profile mix:** at least 2 home cooks, at least 1 casual browser, mixed comfort levels with web apps, none who have seen RecipeBook before.
- **Pilot:** run one full session with a non-target user first. Use the pilot to shake out task wording and timing; if the pilot exposes major plan issues (ambiguous wording, impossible tasks, missing pre-conditions), revise the plan before recruiting the real five.
- **Incentive:** small thank-you per participant (gift card or equivalent).

---

## 6. Task Scenarios (TC-USE-*)

Tasks are written as goals, not UI instructions. Read the **prompt** verbatim to each participant.

**Prerequisite for all scenarios:** server running locally (`npm start`), browser open to `http://localhost:3000`, in-memory data freshly reset (seeded with Classic Pancakes, Grandma's Chili, Avocado Toast).

### TC-USE-01: First-time login
- **Setup:** Login screen visible. Hand the participant the credentials (`admin` / `password123`) on paper.
- **Prompt:** "You've been given these credentials. Log in to RecipeBook."
- **Validate:** Participant reaches the main app view within 30 s without help.
- **Watch for:** Hesitation over where to enter credentials, confusion about the "log in" button styling.

### TC-USE-02: Find the chili recipe
- **Setup:** Logged in, recipe list visible.
- **Prompt:** "Imagine you want to make chili for dinner. Find the chili recipe."
- **Validate:** Participant locates Grandma's Chili within 30 s.
- **Watch for:** Does the participant scroll the list or reach for search? Does real-time filtering feel responsive or confusing?

### TC-USE-03: Read Classic Pancakes in detail
- **Setup:** Logged in, recipe list visible.
- **Prompt:** "You want to make pancakes. Find the full ingredients and instructions for the Classic Pancakes recipe."
- **Validate:** Participant expands the card and reads the full body within 30 s.
- **Watch for:** Is the click-to-expand affordance discoverable? Do they try to click the title vs. the whole card vs. an arrow they expected to see?

### TC-USE-04: Add a weeknight dinner recipe
- **Setup:** Logged in, recipe list visible.
- **Prompt:** "Add a recipe for one of your favourite weeknight dinners. Include enough detail that someone else in your household could cook it."
- **Validate:** Participant opens the modal, fills required fields, submits, and sees the new recipe in the list within 180 s.
- **Watch for:** Do they find the "+ add recipe" button? Do they understand which fields are required (the asterisks)? Do they expect a category they don't see in the dropdown?

### TC-USE-05: Submit with a blank ingredients field, then recover
- **Setup:** Logged in, modal open with name and instructions filled in but ingredients left blank.
- **Prompt:** "Try to save this recipe. If something goes wrong, fix it and save again."
- **Validate:** Participant encounters the validation error, identifies which field caused it, fills it in, and saves within 90 s.
- **Watch for:** Is the error message noticed? Is the cause obvious? Do they understand how to fix it without prompting?

### TC-USE-06: Change servings on Grandma's Chili
- **Setup:** Logged in, recipe list visible.
- **Prompt:** "Grandma's Chili currently serves 6. Update it so it serves 8."
- **Validate:** Participant opens the edit modal, changes the servings, saves, and the change is reflected in the list within 90 s.
- **Watch for:** Do they find the edit control? Do they look on the card vs. inside an expanded view? Do they realise they need to save?

### TC-USE-07: Remove Avocado Toast
- **Setup:** Logged in, recipe list visible.
- **Prompt:** "You're tired of avocado toast. Remove it from the list."
- **Validate:** Participant deletes the recipe and confirms within 30 s; the recipe disappears from the list.
- **Watch for:** Does the confirmation dialog feel reassuring or like an obstacle? Any anxiety about whether the action is reversible?

### TC-USE-08: Log out
- **Setup:** Logged in, recipe list visible.
- **Prompt:** "You're done. Sign out so your roommate can use the app."
- **Validate:** Participant returns to the login screen within 30 s.
- **Watch for:** How long does it take to spot the **log out** button? Do they look in the header, a menu, the bottom of the page?

---

## 7. Metrics

Recorded per task and per session.

### Quantitative

| Metric | Collection method | Notes |
|---|---|---|
| Task completion | Moderator marks `unassisted` / `assisted` / `failed` | Effectiveness signal. |
| Time on task | Stopwatch from prompt-read to validate-condition met | Efficiency signal; compare against target times in section 6. |
| Misclicks | Tally of clicks that did not advance the task | Efficiency signal. |
| Help requests | Count of times participant asks the moderator for direction | Efficiency + effectiveness signal. |
| Single-ease question (per task) | "How easy was that?" on a 1 (very difficult) – 5 (very easy) Likert scale | Per-task satisfaction. |
| System Usability Scale (per session) | Brooke's 10-item SUS, scored 0–100 | Overall satisfaction; comparable across sessions and over time. |

### Qualitative

Verbatim quotes, observed emotion (frustration / hesitation / delight), pain points, surprises. The moderator (or observer, if available) keeps a running log per task.

---

## 8. Severity Rating for Findings

Each issue raised in the report is tagged on Nielsen's 0–4 severity scale, so the team has a defensible way to prioritise:

| Rating | Meaning |
|---|---|
| 0 | Not a usability problem. |
| 1 | Cosmetic — fix if time allows. |
| 2 | Minor — low priority. |
| 3 | Major — high priority; fix before launch. |
| 4 | Catastrophic — must fix before any user sees the product again. |

---

## 9. Session Protocol

A single session runs ~30 minutes:

1. **Pre-session (moderator only).** Restart `npm start` so the in-memory store resets to the seeded data. Confirm the app loads at `http://localhost:3000`.
2. **Intro (2 min).** Explain that the *app* is being tested, not the participant. Encourage thinking aloud. State that there are no right or wrong answers and that the participant can pause or stop at any time.
3. **Tasks (≈20 min).** Present TC-USE-01 through TC-USE-08 in order. Moderator reads each prompt verbatim, stays neutral, does not lead, and records metrics. After each task, ask the single-ease question.
4. **Post-test (5 min).** Administer the SUS questionnaire. Ask two open questions: *"What was confusing?"* and *"What felt good?"*.
5. **Debrief (3 min).** Thank the participant, log any follow-ups.

**Moderator discipline:** answer participant questions with neutral redirects ("What would you expect to happen?") rather than instructions. Only intervene if the participant is fully stuck and unable to continue.

---

## 10. Reporting

After all sessions, produce a `usabilitytestreport.md` that mirrors the structure of the existing `testreport.md`:

- Per-task results table (completion rate, mean time, mean ease).
- Top findings ranked by Nielsen severity (section 8).
- Recommended changes, each pointing at a specific file and line where the fix would land (e.g. `frontend/index.html:48` for the search input, `frontend/index.html:40` for logout placement).
- SUS score and a one-paragraph qualitative summary.

The report is out of scope for this plan — it is produced after the sessions run.

---

## 11. Risks & Limitations

- **Small N.** Five participants surface ~85% of issues, not all of them. Treat findings as directional, not exhaustive.
- **Observer effect.** Participants behave differently when watched; some hesitations are an artefact of the test, not the UI.
- **Context gap.** RecipeBook is meant to be used in a kitchen (interruptions, wet hands, glance-and-go). Remote sessions at a desk will under-sample those conditions; flag this when interpreting any "looks fine" finding on the read path.
- **Moderator bias.** Leading questions, even subtle ones, skew results. The pilot session (section 5) is the main control for this.
- **Cost.** Moderator time, participant time, and incentives are real costs. Budget ≈ 6 sessions × 30 min plus prep, analysis, and report writing.
