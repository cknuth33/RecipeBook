const request = require('supertest');

let app;

beforeEach(() => {
    jest.resetModules();
    app = require('./server');
});

// ─── POST /api/auth/login ─────────────────────────────────────────────────────

test('TC-API-01: Returns 200 and success with valid credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({ username: 'admin', password: 'password123' });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
});

test('TC-API-02: Returns 401 with wrong password', async () => {
    const res = await request(app).post('/api/auth/login').send({ username: 'admin', password: 'wrong' });
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
});

test('TC-API-03: Returns 401 with unknown username', async () => {
    const res = await request(app).post('/api/auth/login').send({ username: 'unknown', password: 'password123' });
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
});

test('TC-API-04: Returns 401 when body is empty', async () => {
    const res = await request(app).post('/api/auth/login').send({});
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
});

// ─── GET /api/recipes ─────────────────────────────────────────────────────────

test('TC-API-05: Returns 200 and an array of recipes', async () => {
    const res = await request(app).get('/api/recipes');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.recipes)).toBe(true);
});

test('TC-API-06: Returns all seeded recipes on a fresh start', async () => {
    const res = await request(app).get('/api/recipes');
    expect(res.body.recipes).toHaveLength(3);
});

// ─── GET /api/recipes/:id ─────────────────────────────────────────────────────

test('TC-API-07: Returns 200 and the recipe for a valid id', async () => {
    const res = await request(app).get('/api/recipes/1');
    expect(res.status).toBe(200);
    expect(res.body.recipe.name).toBe('Classic Pancakes');
});

test('TC-API-08: Returns 404 for an unknown id', async () => {
    const res = await request(app).get('/api/recipes/9999');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
});

// ─── POST /api/recipes ────────────────────────────────────────────────────────

test('TC-API-09: Creates a recipe with all fields and returns 201', async () => {
    const res = await request(app).post('/api/recipes').send({
        name: 'Test Recipe',
        category: 'Lunch',
        servings: 2,
        ingredients: 'test ingredients',
        instructions: 'test instructions',
    });
    expect(res.status).toBe(201);
    expect(res.body.recipe.name).toBe('Test Recipe');
});

test('TC-API-10: Creates a recipe with only required fields and returns 201', async () => {
    const res = await request(app).post('/api/recipes').send({
        name: 'Minimal Recipe',
        ingredients: 'some stuff',
        instructions: 'do something',
    });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
});

test('TC-API-11: Returns 400 when name is missing', async () => {
    const res = await request(app).post('/api/recipes').send({
        ingredients: 'some stuff',
        instructions: 'do something',
    });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
});

test('TC-API-12: Returns 400 when ingredients is missing', async () => {
    const res = await request(app).post('/api/recipes').send({
        name: 'Test',
        instructions: 'do something',
    });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
});

test('TC-API-13: Returns 400 when instructions is missing', async () => {
    const res = await request(app).post('/api/recipes').send({
        name: 'Test',
        ingredients: 'some stuff',
    });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
});

// ─── PUT /api/recipes/:id ─────────────────────────────────────────────────────

test('TC-API-14: Updates an existing recipe and returns 200', async () => {
    const res = await request(app).put('/api/recipes/1').send({
        name: 'Updated Pancakes',
        ingredients: 'flour, eggs',
        instructions: 'mix and cook',
    });
    expect(res.status).toBe(200);
    expect(res.body.recipe.name).toBe('Updated Pancakes');
});

test('TC-API-15: Returns 404 when updating a non-existent recipe', async () => {
    const res = await request(app).put('/api/recipes/9999').send({
        name: 'Ghost',
        ingredients: 'nothing',
        instructions: 'nothing',
    });
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
});

// ─── DELETE /api/recipes/:id ──────────────────────────────────────────────────

test('TC-API-16: Deletes an existing recipe and returns 200', async () => {
    const res = await request(app).delete('/api/recipes/1');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
});

test('TC-API-17: Recipe is no longer returned after deletion', async () => {
    await request(app).delete('/api/recipes/1');
    const res = await request(app).get('/api/recipes/1');
    expect(res.status).toBe(404);
});

test('TC-API-18: Returns 404 when deleting a non-existent recipe', async () => {
    const res = await request(app).delete('/api/recipes/9999');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
});