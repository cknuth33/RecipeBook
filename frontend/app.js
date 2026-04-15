const API = '/api';

let recipes = [];
let editingId = null;
let currentUser = null;

// ─────────────────────────────────────────────
//  AUTH
// ─────────────────────────────────────────────

async function login() {
  const username = document.getElementById('login-username').value.trim();
  const password = document.getElementById('login-password').value;
  const errorEl = document.getElementById('login-error');

  errorEl.classList.remove('show');

  const res = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json();

  if (res.ok && data.success) {
    currentUser = data.username;
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('app-section').classList.add('visible');
    document.getElementById('current-user').textContent = currentUser;
    loadRecipes();
  } else {
    // Failure path: show error from API (401)
    errorEl.textContent = data.message || 'Login failed.';
    errorEl.classList.add('show');
  }
}

function logout() {
  currentUser = null;
  recipes = [];
  document.getElementById('app-section').classList.remove('visible');
  document.getElementById('login-section').style.display = '';
  document.getElementById('login-username').value = '';
  document.getElementById('login-password').value = '';
  document.getElementById('login-error').classList.remove('show');
}

// ─────────────────────────────────────────────
//  API CALLS
// ─────────────────────────────────────────────

async function loadRecipes() {
  const res = await fetch(`${API}/recipes`);
  const data = await res.json();

  if (res.ok && data.success) {
    recipes = data.recipes;
    renderRecipes();
  } else {
    showStatus('Failed to load recipes.', true);
  }
}

async function saveRecipe() {
  const fields = {
    name: document.getElementById('f-name').value,
    category: document.getElementById('f-category').value,
    servings: document.getElementById('f-servings').value,
    ingredients: document.getElementById('f-ingredients').value,
    instructions: document.getElementById('f-instructions').value,
  };

  clearErrors();

  // Client-side validation before hitting the API
  let hasError = false;
  if (!fields.name.trim()) {
    document.getElementById('err-name').classList.add('show');
    hasError = true;
  }
  if (!fields.ingredients.trim()) {
    document.getElementById('err-ingredients').classList.add('show');
    hasError = true;
  }
  if (!fields.instructions.trim()) {
    document.getElementById('err-instructions').classList.add('show');
    hasError = true;
  }
  if (hasError) return;

  let res, data;

  if (editingId) {
    // PUT — update existing recipe
    res = await fetch(`${API}/recipes/${editingId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fields),
    });
  } else {
    // POST — create new recipe
    res = await fetch(`${API}/recipes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fields),
    });
  }

  data = await res.json();

  if (res.ok && data.success) {
    closeModal();
    await loadRecipes();
    showStatus(editingId ? 'Recipe updated.' : 'Recipe added.', false);
  } else {
    // Failure path: 400 bad request or 404 not found
    showStatus(data.message || 'Failed to save recipe.', true);
  }
}

async function handleDelete(id) {
  if (!confirm('Delete this recipe?')) return;

  const res = await fetch(`${API}/recipes/${id}`, { method: 'DELETE' });
  const data = await res.json();

  if (res.ok && data.success) {
    await loadRecipes();
    showStatus('Recipe deleted.', false);
  } else {
    // Failure path: 404 not found
    showStatus(data.message || 'Failed to delete recipe.', true);
  }
}

// ─────────────────────────────────────────────
//  UI RENDERING
// ─────────────────────────────────────────────

function renderRecipes() {
  const query = document.getElementById('search-input').value.toLowerCase().trim();
  const visible = query
    ? recipes.filter(r =>
        r.name.toLowerCase().includes(query) ||
        r.ingredients.toLowerCase().includes(query) ||
        (r.category && r.category.toLowerCase().includes(query))
      )
    : recipes;

  const list = document.getElementById('recipe-list');
  const count = document.getElementById('recipe-count');

  count.textContent = `${visible.length} recipe${visible.length !== 1 ? 's' : ''}${query ? ' found' : ' saved'}`;

  if (visible.length === 0) {
    list.innerHTML = `
      <div class="empty-state">
        <strong>${query ? 'No matches.' : 'No recipes yet.'}</strong>
        ${query ? 'Try a different search term.' : 'Click "+ add recipe" to get started.'}
      </div>`;
    return;
  }

  list.innerHTML = visible.map(r => `
    <div class="recipe-card" id="card-${r.id}">
      <div class="card-header" onclick="toggleCard('${r.id}')">
        <div>
          <h2>${escapeHtml(r.name)}</h2>
          <div class="card-meta">
            ${r.category ? `<span>📂 ${escapeHtml(r.category)}</span>` : ''}
            ${r.servings ? `<span>🍽 ${r.servings} servings</span>` : ''}
          </div>
        </div>
        <div class="card-actions">
          <button class="secondary" onclick="event.stopPropagation(); openModal('${r.id}')">edit</button>
          <button class="danger" onclick="event.stopPropagation(); handleDelete('${r.id}')">delete</button>
        </div>
      </div>
      <div class="card-body" id="body-${r.id}">
        <h3>ingredients</h3>
        <ul>
          ${r.ingredients.split('\n').filter(l => l.trim()).map(l => `<li>${escapeHtml(l.trim())}</li>`).join('')}
        </ul>
        <h3>instructions</h3>
        <p>${escapeHtml(r.instructions).replace(/\n/g, '<br/>')}</p>
      </div>
    </div>
  `).join('');
}

function toggleCard(id) {
  document.getElementById('body-' + id).classList.toggle('open');
}

// ─────────────────────────────────────────────
//  MODAL
// ─────────────────────────────────────────────

function openModal(id) {
  editingId = id || null;
  clearErrors();

  const title = document.getElementById('modal-title');
  const btn = document.getElementById('modal-save-btn');

  if (editingId) {
    const r = recipes.find(r => r.id === editingId);
    title.textContent = 'edit recipe';
    btn.textContent = 'save changes';
    document.getElementById('f-name').value = r.name;
    document.getElementById('f-category').value = r.category || '';
    document.getElementById('f-servings').value = r.servings || '';
    document.getElementById('f-ingredients').value = r.ingredients;
    document.getElementById('f-instructions').value = r.instructions;
  } else {
    title.textContent = 'add recipe';
    btn.textContent = 'save recipe';
    document.getElementById('f-name').value = '';
    document.getElementById('f-category').value = '';
    document.getElementById('f-servings').value = '';
    document.getElementById('f-ingredients').value = '';
    document.getElementById('f-instructions').value = '';
  }

  document.getElementById('modal-overlay').classList.add('open');
  document.getElementById('f-name').focus();
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('open');
  editingId = null;
}

function handleOverlayClick(e) {
  if (e.target === document.getElementById('modal-overlay')) closeModal();
}

// ─────────────────────────────────────────────
//  UTILITIES
// ─────────────────────────────────────────────

function clearErrors() {
  document.querySelectorAll('.error-msg').forEach(el => el.classList.remove('show'));
}

function showStatus(message, isError) {
  const banner = document.getElementById('status-banner');
  banner.textContent = message;
  banner.className = isError ? 'error' : 'success';
  setTimeout(() => { banner.className = ''; }, 3000);
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ─────────────────────────────────────────────
//  INIT
// ─────────────────────────────────────────────

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

// Allow pressing Enter in the login form
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('login-password').addEventListener('keydown', e => {
    if (e.key === 'Enter') login();
  });
});
