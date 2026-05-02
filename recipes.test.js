const { validateRecipe, addRecipe, deleteRecipe, searchRecipes, createRecipe, updateRecipe } = require('./recipes');

// ─── validateRecipe ───────────────────────────────────────────────────────────

test('TC-UNIT-01: validateRecipe fails when name is empty', () => {
  const result = validateRecipe({ name: '', ingredients: 'eggs', instructions: 'cook' });
  expect(result.valid).toBe(false);
  expect(result.errors).toContain('name');
});

test('TC-UNIT-02: validateRecipe fails when name is whitespace only', () => {
  const result = validateRecipe({ name: '   ', ingredients: 'eggs', instructions: 'cook' });
  expect(result.valid).toBe(false);
  expect(result.errors).toContain('name');
});

test('TC-UNIT-03: validateRecipe fails when ingredients is missing', () => {
  const result = validateRecipe({ name: 'Toast', ingredients: '', instructions: 'cook' });
  expect(result.valid).toBe(false);
  expect(result.errors).toContain('ingredients');
});

test('TC-UNIT-04: validateRecipe fails when instructions is missing', () => {
  const result = validateRecipe({ name: 'Toast', ingredients: 'bread', instructions: '' });
  expect(result.valid).toBe(false);
  expect(result.errors).toContain('instructions');
});

test('TC-UNIT-05: validateRecipe fails when servings is not a positive number', () => {
  const result = validateRecipe({ name: 'Toast', ingredients: 'bread', instructions: 'cook', servings: 0 });
  expect(result.valid).toBe(false);
  expect(result.errors).toContain('servings');
});

test('TC-UNIT-06: validateRecipe passes with all required fields present', () => {
  const result = validateRecipe({ name: 'Toast', ingredients: 'bread', instructions: 'cook' });
  expect(result.valid).toBe(true);
  expect(result.errors).toHaveLength(0);
});

test('TC-UNIT-07: validateRecipe passes with optional servings as a positive number', () => {
  const result = validateRecipe({ name: 'Toast', ingredients: 'bread', instructions: 'cook', servings: 2 });
  expect(result.valid).toBe(true);
  expect(result.errors).toHaveLength(0);
});

// ─── createRecipe ─────────────────────────────────────────────────────────────

test('TC-UNIT-08: createRecipe returns an object with the expected fields', () => {
  const recipe = createRecipe({ name: 'Toast', ingredients: 'bread', instructions: 'toast it' });
  expect(recipe).toHaveProperty('id');
  expect(recipe).toHaveProperty('name', 'Toast');
  expect(recipe).toHaveProperty('category');
  expect(recipe).toHaveProperty('servings');
  expect(recipe).toHaveProperty('ingredients');
  expect(recipe).toHaveProperty('instructions');
  expect(recipe).toHaveProperty('createdAt');
});

test('TC-UNIT-09: createRecipe trims whitespace from name, ingredients, and instructions', () => {
  const recipe = createRecipe({ name: '  Toast  ', ingredients: '  bread  ', instructions: '  toast it  ' });
  expect(recipe.name).toBe('Toast');
  expect(recipe.ingredients).toBe('bread');
  expect(recipe.instructions).toBe('toast it');
});

test('TC-UNIT-10: createRecipe defaults category to empty string when not provided', () => {
  const recipe = createRecipe({ name: 'Toast', ingredients: 'bread', instructions: 'toast it' });
  expect(recipe.category).toBe('');
});

// ─── addRecipe ────────────────────────────────────────────────────────────────

test('TC-UNIT-11: addRecipe increases array length by 1', () => {
  const before = [];
  const recipe = createRecipe({ name: 'Toast', ingredients: 'bread', instructions: 'toast it' });
  const after = addRecipe(before, recipe);
  expect(after.length).toBe(1);
});

test('TC-UNIT-12: addRecipe does not mutate the original array', () => {
  const original = [];
  const recipe = createRecipe({ name: 'Toast', ingredients: 'bread', instructions: 'toast it' });
  addRecipe(original, recipe);
  expect(original).toHaveLength(0);
});

// ─── updateRecipe ─────────────────────────────────────────────────────────────

test('TC-UNIT-13: updateRecipe updates the correct recipe by id', () => {
  const recipe = createRecipe({ name: 'Toast', ingredients: 'bread', instructions: 'toast it' });
  const list = addRecipe([], recipe);
  const updated = updateRecipe(list, recipe.id, { name: 'French Toast', ingredients: 'bread, eggs', instructions: 'dip and fry' });
  expect(updated[0].name).toBe('French Toast');
});

test('TC-UNIT-14: updateRecipe leaves other recipes unchanged', () => {
  const r1 = { id: 'r1', name: 'Toast', ingredients: 'bread', instructions: 'toast it', category: '', servings: null, createdAt: '' };
  const r2 = { id: 'r2', name: 'Eggs', ingredients: 'eggs', instructions: 'fry', category: '', servings: null, createdAt: '' };
  const list = addRecipe(addRecipe([], r1), r2);
  const updated = updateRecipe(list, r1.id, { name: 'French Toast', ingredients: 'bread, eggs', instructions: 'dip and fry' });
  expect(updated[1].name).toBe('Eggs');
});

test('TC-UNIT-15: updateRecipe does not mutate the original array', () => {
  const recipe = createRecipe({ name: 'Toast', ingredients: 'bread', instructions: 'toast it' });
  const list = addRecipe([], recipe);
  updateRecipe(list, recipe.id, { name: 'French Toast', ingredients: 'bread, eggs', instructions: 'dip and fry' });
  expect(list[0].name).toBe('Toast');
});

// ─── deleteRecipe ─────────────────────────────────────────────────────────────

test('TC-UNIT-16: deleteRecipe removes the correct recipe', () => {
  const recipe = createRecipe({ name: 'Eggs', ingredients: 'eggs', instructions: 'fry' });
  const list = addRecipe([], recipe);
  const after = deleteRecipe(list, recipe.id);
  expect(after.length).toBe(0);
});

test('TC-UNIT-17: deleteRecipe does not remove unrelated recipes', () => {
  const r1 = { id: 'r1', name: 'Toast', ingredients: 'bread', instructions: 'toast it', category: '', servings: null, createdAt: '' };
  const r2 = { id: 'r2', name: 'Eggs', ingredients: 'eggs', instructions: 'fry', category: '', servings: null, createdAt: '' };
  const list = addRecipe(addRecipe([], r1), r2);
  const after = deleteRecipe(list, r1.id);
  expect(after).toHaveLength(1);
  expect(after[0].name).toBe('Eggs');
});

// ─── searchRecipes ────────────────────────────────────────────────────────────

test('TC-UNIT-18: searchRecipes is case-insensitive', () => {
  const recipe = createRecipe({ name: 'Pancakes', ingredients: 'flour', instructions: 'mix' });
  const list = addRecipe([], recipe);
  expect(searchRecipes(list, 'pancakes').length).toBe(1);
  expect(searchRecipes(list, 'PANCAKES').length).toBe(1);
});

test('TC-UNIT-19: searchRecipes matches by ingredient', () => {
  const recipe = createRecipe({ name: 'Pancakes', ingredients: 'flour, eggs, milk', instructions: 'mix and cook' });
  const list = addRecipe([], recipe);
  expect(searchRecipes(list, 'flour').length).toBe(1);
});

test('TC-UNIT-20: searchRecipes returns empty array when no recipes match', () => {
  const recipe = createRecipe({ name: 'Pancakes', ingredients: 'flour', instructions: 'mix' });
  const list = addRecipe([], recipe);
  expect(searchRecipes(list, 'xyz').length).toBe(0);
});

test('TC-UNIT-21: searchRecipes returns all recipes when query is empty', () => {
  const r1 = createRecipe({ name: 'Pancakes', ingredients: 'flour', instructions: 'mix' });
  const r2 = createRecipe({ name: 'Eggs', ingredients: 'eggs', instructions: 'fry' });
  const list = addRecipe(addRecipe([], r1), r2);
  expect(searchRecipes(list, '').length).toBe(2);
});