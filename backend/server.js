const express = require('express');
const path = require('path');
const db = require('./db.json');

const app = express();
app.use(express.json());

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../frontend')));

// In-memory copy of the db so mutations don't require disk writes
const data = {
  users: [...db.users],
  recipes: db.recipes.map(r => ({ ...r })),
};

// ─── AUTH ────────────────────────────────────────────────────────────────────

// POST /api/auth/login
// Success: { username: 'admin', password: 'password123' } → 200
// Fail:    any other credentials               → 401
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;

  const user = data.users.find(
    u => u.username === username && u.password === password
  );

  if (user) {
    res.json({ success: true, message: 'Login successful', username: user.username });
  } else {
    res.status(401).json({ success: false, message: 'Invalid username or password' });
  }
});

// ─── RECIPES ─────────────────────────────────────────────────────────────────

// GET /api/recipes
// Always returns the full list → 200
app.get('/api/recipes', (req, res) => {
  res.json({ success: true, recipes: data.recipes });
});

// GET /api/recipes/:id
// Found → 200, not found → 404
app.get('/api/recipes/:id', (req, res) => {
  const recipe = data.recipes.find(r => r.id === req.params.id);

  if (recipe) {
    res.json({ success: true, recipe });
  } else {
    res.status(404).json({ success: false, message: 'Recipe not found' });
  }
});

// POST /api/recipes
// Valid body (name + ingredients + instructions required) → 201
// Missing required fields → 400
app.post('/api/recipes', (req, res) => {
  const { name, category, servings, ingredients, instructions } = req.body;

  if (!name || !name.trim() || !ingredients || !ingredients.trim() || !instructions || !instructions.trim()) {
    return res.status(400).json({
      success: false,
      message: 'name, ingredients, and instructions are required',
    });
  }

  const newRecipe = {
    id: Date.now().toString(),
    name: name.trim(),
    category: category || '',
    servings: servings ? Number(servings) : null,
    ingredients: ingredients.trim(),
    instructions: instructions.trim(),
    createdAt: new Date().toISOString(),
  };

  data.recipes.push(newRecipe);
  res.status(201).json({ success: true, recipe: newRecipe });
});

// PUT /api/recipes/:id
// Found → 200, not found → 404
app.put('/api/recipes/:id', (req, res) => {
  const index = data.recipes.findIndex(r => r.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Recipe not found' });
  }

  const { name, category, servings, ingredients, instructions } = req.body;
  data.recipes[index] = {
    ...data.recipes[index],
    name: name ? name.trim() : data.recipes[index].name,
    category: category !== undefined ? category : data.recipes[index].category,
    servings: servings ? Number(servings) : data.recipes[index].servings,
    ingredients: ingredients ? ingredients.trim() : data.recipes[index].ingredients,
    instructions: instructions ? instructions.trim() : data.recipes[index].instructions,
  };

  res.json({ success: true, recipe: data.recipes[index] });
});

// DELETE /api/recipes/:id
// Found → 200, not found → 404
app.delete('/api/recipes/:id', (req, res) => {
  const index = data.recipes.findIndex(r => r.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Recipe not found' });
  }

  data.recipes.splice(index, 1);
  res.json({ success: true, message: 'Recipe deleted' });
});

// ─── START ───────────────────────────────────────────────────────────────────

if (require.main === module) {
  const PORT = 3000;
  app.listen(PORT, () => {
    console.log(`Recipe Box running at http://localhost:${PORT}`);
  });
}

module.exports = app;
