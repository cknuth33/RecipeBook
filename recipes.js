function validateRecipe(recipe) {
    const errors = [];
    if (!recipe.name || recipe.name.trim() === '') {
      errors.push('name');
    }
    if (!recipe.ingredients || recipe.ingredients.trim() === '') {
      errors.push('ingredients');
    }
    if (!recipe.instructions || recipe.instructions.trim() === '') {
      errors.push('instructions');
    }
    if (recipe.servings !== '' && recipe.servings !== null && recipe.servings !== undefined) {
      const n = Number(recipe.servings);
      if (isNaN(n) || n < 1) errors.push('servings');
    }
    return { valid: errors.length === 0, errors };
  }

  /**
   * Create a new recipe object with a generated id.
   */
  function createRecipe(fields) {
    return {
      id: Date.now().toString(),
      name: fields.name.trim(),
      category: fields.category || '',
      servings: fields.servings ? Number(fields.servings) : null,
      ingredients: fields.ingredients.trim(),
      instructions: fields.instructions.trim(),
      createdAt: new Date().toISOString(),
    };
  }

  /**
   * Add a recipe to an array. Returns a new array (immutable).
   */
  function addRecipe(recipes, recipe) {
    return [...recipes, recipe];
  }

  /**
   * Update a recipe by id. Returns a new array (immutable).
   */
  function updateRecipe(recipes, id, fields) {
    return recipes.map(r =>
      r.id === id
        ? { ...r, ...fields, name: fields.name.trim(), ingredients: fields.ingredients.trim(), instructions: fields.instructions.trim() }
        : r
    );
  }

  /**
   * Delete a recipe by id. Returns a new array (immutable).
   */
  function deleteRecipe(recipes, id) {
    return recipes.filter(r => r.id !== id);
  }

  /**
   * Search recipes by name or ingredient.
   * Returns filtered array.
   */
  function searchRecipes(recipes, query) {
    if (!query || query.trim() === '') return recipes;
    const q = query.toLowerCase().trim();
    return recipes.filter(r =>
      r.name.toLowerCase().includes(q) ||
      r.ingredients.toLowerCase().includes(q) ||
      (r.category && r.category.toLowerCase().includes(q))
    );
  }

  module.exports = { validateRecipe, createRecipe, addRecipe, updateRecipe, deleteRecipe, searchRecipes };