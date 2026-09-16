<template>
  <main class="categories-view">
    <header class="page-header">
      <div>
        <h1>Categorías</h1>
        <p>Administración de categorías de productos.</p>
      </div>

      <button
        type="button"
        :disabled="categoryStore.loading"
        @click="startCreate"
      >
        Nueva categoría
      </button>
    </header>

    <div v-if="isFormVisible" class="modal-overlay" @click.self="cancelEdit">
      <section class="category-form">
        <div class="modal-header">
          <h2>{{ editingId === null ? 'Nueva categoría' : 'Editar categoría' }}</h2>
          <button class="close-btn" @click="cancelEdit" aria-label="Cerrar">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label for="category-name">Nombre</label>
            <input
              id="category-name"
              v-model="name"
              type="text"
              maxlength="100"
              required
              :disabled="categoryStore.loading"
            />
          </div>

          <div class="form-actions">
            <button type="submit" :disabled="categoryStore.loading">
              {{ categoryStore.loading ? 'Guardando...' : editingId === null ? 'Crear' : 'Actualizar' }}
            </button>

            <button type="button" :disabled="categoryStore.loading" @click="cancelEdit">
              Cancelar
            </button>
          </div>
        </form>
      </section>
    </div>

    <p
      v-if="categoryStore.errorMessage"
      class="error-message"
    >
      {{ categoryStore.errorMessage }}
    </p>

    <section class="category-list">
      <h2>Listado</h2>

      <p v-if="categoryStore.loading && !categoryStore.categories.length">
        Cargando categorías...
      </p>

      <p v-else-if="!categoryStore.categories.length">
        No existen categorías registradas.
      </p>

      <table v-else>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="category in categoryStore.categories"
            :key="category.id"
          >
            <td>{{ category.id }}</td>
            <td>{{ category.name }}</td>
            <td class="actions">
              <button
                type="button"
                :disabled="categoryStore.loading"
                @click="startEdit(category)"
              >
                Editar
              </button>

              <button
                type="button"
                :disabled="categoryStore.loading"
                @click="handleDelete(category.id)"
              >
                Eliminar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  </main>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';

import { useCategoryStore } from '@/modules/categories/stores/categoryStore';
import type { Category } from '@/infrastructure/rest/categoryApi';

const categoryStore = useCategoryStore();

const name = ref('');
const editingId = ref<number | null>(null);
const isFormVisible = ref(false);

onMounted(() => {
  categoryStore.fetchCategories();
});

function startCreate(): void {
  editingId.value = null;
  name.value = '';
  isFormVisible.value = true;
}

function startEdit(category: Category): void {
  editingId.value = category.id;
  name.value = category.name;
  isFormVisible.value = true;
}

function cancelEdit(): void {
  editingId.value = null;
  name.value = '';
  isFormVisible.value = false;
}

async function handleSubmit(): Promise<void> {
  const categoryName = name.value.trim();

  if (!categoryName) {
    return;
  }

  if (editingId.value === null) {
    await categoryStore.createCategory({
      name: categoryName
    });

    cancelEdit();
    return;
  }

  await categoryStore.updateCategory(
    editingId.value,
    {
      name: categoryName
    }
  );

  cancelEdit();
}

async function handleDelete(id: number): Promise<void> {
  const confirmed = window.confirm(
    '¿Está seguro de eliminar esta categoría?'
  );

  if (!confirmed) {
    return;
  }

  await categoryStore.deleteCategory(id);

  if (editingId.value === id) {
    cancelEdit();
  }
}
</script>

<style scoped>
.categories-view {
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2.5rem;
}

.page-header h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 0.25rem;
  letter-spacing: -0.025em;
}

.page-header p {
  color: #64748b;
  font-size: 1rem;
  margin: 0;
}

.category-list {
  background: #ffffff;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
  margin-bottom: 2rem;
  border: 1px solid rgba(226, 232, 240, 0.8);
}

.category-list h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f1f5f9;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease-out;
}

.category-form {
  background: #ffffff;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  width: 100%;
  max-width: 500px;
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f1f5f9;
}

.modal-header h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.close-btn {
  background: transparent !important;
  border: none;
  color: #94a3b8;
  padding: 0.5rem;
  cursor: pointer;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  box-shadow: none !important;
}

.close-btn svg {
  width: 24px;
  height: 24px;
}

.close-btn:hover {
  background: #f1f5f9 !important;
  color: #ef4444 !important;
  transform: none !important;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #475569;
}

input {
  padding: 0.75rem 1rem;
  border-radius: 10px;
  border: 1px solid #cbd5e1;
  background: #f8fafc;
  font-size: 1rem;
  color: #1e293b;
  transition: all 0.2s ease;
  outline: none;
}

input:focus {
  border-color: #3b82f6;
  background: #ffffff;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
}

.form-actions {
  display: flex;
  gap: 1rem;
}

button {
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

button[type="submit"], .page-header button {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
  box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.3);
}

button[type="submit"]:hover:not(:disabled), .page-header button:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 6px 12px -2px rgba(59, 130, 246, 0.4);
}

button[type="button"] {
  background: #f1f5f9;
  color: #475569;
  border: 1px solid #e2e8f0;
}

button[type="button"]:hover:not(:disabled) {
  background: #e2e8f0;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-message {
  background: #fef2f2;
  color: #ef4444;
  padding: 1rem;
  border-radius: 10px;
  border: 1px solid #fecaca;
  margin-bottom: 2rem;
}

table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  margin-top: 1rem;
}

th {
  background: #f8fafc;
  color: #475569;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
  padding: 1rem;
  text-align: left;
  border-bottom: 2px solid #e2e8f0;
}

td {
  padding: 1rem;
  color: #334155;
  border-bottom: 1px solid #f1f5f9;
  vertical-align: middle;
}

tr:last-child td {
  border-bottom: none;
}

tr:hover td {
  background-color: #f8fafc;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.actions button {
  padding: 0.4rem 0.75rem;
  font-size: 0.85rem;
  border-radius: 6px;
}
</style>