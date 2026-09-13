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

    <section class="category-form">
      <h2>
        {{ editingId === null ? 'Nueva categoría' : 'Editar categoría' }}
      </h2>

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
          <button
            type="submit"
            :disabled="categoryStore.loading"
          >
            {{
              categoryStore.loading
                ? 'Guardando...'
                : editingId === null
                  ? 'Crear'
                  : 'Actualizar'
            }}
          </button>

          <button
            v-if="editingId !== null"
            type="button"
            :disabled="categoryStore.loading"
            @click="cancelEdit"
          >
            Cancelar
          </button>
        </div>
      </form>
    </section>

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

onMounted(() => {
  categoryStore.fetchCategories();
});

function startCreate(): void {
  editingId.value = null;
  name.value = '';
}

function startEdit(category: Category): void {
  editingId.value = category.id;
  name.value = category.name;
}

function cancelEdit(): void {
  editingId.value = null;
  name.value = '';
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

    name.value = '';
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
  padding: 2rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.page-header h1 {
  margin-bottom: 0.5rem;
}

.category-form {
  max-width: 500px;
  margin-bottom: 2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.form-actions {
  display: flex;
  gap: 0.75rem;
}

.error-message {
  margin-bottom: 1rem;
}

.category-list table {
  width: 100%;
  border-collapse: collapse;
}

.category-list th,
.category-list td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.actions {
  display: flex;
  gap: 0.5rem;
}
</style>