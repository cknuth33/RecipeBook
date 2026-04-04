const { validateRecipe, addRecipe, deleteRecipe, searchRecipes, createRecipe } = require('./recipes');

test('validateRecipe fails when name is empty', () => {
  const result = validateRecipe({ name: '', ingredients: 'eggs', instructions: 'cook' });
  expect(result.valid).toBe(false);
  expect(result.errors).toContain('name');
});

test('addRecipe increases array length by 1', () => {
  const before = [];
  const recipe = createRecipe({ name: 'Toast', ingredients: 'bread', instructions: 'toast it' });
  const after = addRecipe(before, recipe);
  expect(after.length).toBe(1);
});

test('deleteRecipe removes the correct recipe', () => {
  const recipe = createRecipe({ name: 'Eggs', ingredients: 'eggs', instructions: 'fry' });
  const list = addRecipe([], recipe);
  const after = deleteRecipe(list, recipe.id);
  expect(after.length).toBe(0);
});

test('searchRecipes is case-insensitive', () => {
  const recipe = createRecipe({ name: 'Pancakes', ingredients: 'flour', instructions: 'mix' });
  const list = addRecipe([], recipe);
  expect(searchRecipes(list, 'pancakes').length).toBe(1);
  expect(searchRecipes(list, 'PANCAKES').length).toBe(1);
});