<template>
  <main class="products-view">
    <header class="page-header">
      <div>
        <h1>Productos</h1>
        <p>Administración de productos.</p>
      </div>

      <button
        type="button"
        :disabled="productStore.loading"
        @click="startCreate"
      >
        Nuevo producto
      </button>
    </header>

    <section class="filters">
      <div class="form-group">
        <label for="search">
          Buscar por nombre
        </label>

        <input
          id="search"
          v-model="search"
          type="search"
          placeholder="Buscar producto..."
        />
      </div>

      <div class="form-group">
        <label for="category-filter">
          Filtrar por categoría
        </label>

        <select
          id="category-filter"
          v-model="selectedCategoryId"
        >
          <option value="">
            Todas las categorías
          </option>

          <option
            v-for="category in categoryStore.categories"
            :key="category.id"
            :value="category.id"
          >
            {{ category.name }}
          </option>
        </select>
      </div>
    </section>

    <section class="product-form">
      <h2>
        {{ editingId === null ? 'Nuevo producto' : 'Editar producto' }}
      </h2>

      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="product-name">
            Nombre
          </label>

          <input
            id="product-name"
            v-model="name"
            type="text"
            maxlength="150"
            required
            :disabled="productStore.loading"
          />
        </div>

        <div class="form-group">
          <label for="product-price">
            Precio
          </label>

          <input
            id="product-price"
            v-model.number="price"
            type="number"
            min="0"
            step="0.01"
            required
            :disabled="productStore.loading"
          />
        </div>

        <div class="form-group">
          <label for="product-category">
            Categoría
          </label>

          <select
            id="product-category"
            v-model.number="categoryId"
            required
            :disabled="productStore.loading"
          >
            <option
              :value="0"
              disabled
            >
              Seleccione una categoría
            </option>

            <option
              v-for="category in categoryStore.categories"
              :key="category.id"
              :value="category.id"
            >
              {{ category.name }}
            </option>
          </select>
        </div>

        <div class="form-actions">
          <button
            type="submit"
            :disabled="productStore.loading"
          >
            {{
              productStore.loading
                ? 'Guardando...'
                : editingId === null
                  ? 'Crear'
                  : 'Actualizar'
            }}
          </button>

          <button
            v-if="editingId !== null"
            type="button"
            :disabled="productStore.loading"
            @click="cancelEdit"
          >
            Cancelar
          </button>
        </div>
      </form>
    </section>

    <p
      v-if="productStore.errorMessage"
      class="error-message"
    >
      {{ productStore.errorMessage }}
    </p>

    <section class="product-list">
      <h2>Listado</h2>

      <p v-if="productStore.loading && !productStore.products.length">
        Cargando productos...
      </p>

      <p v-else-if="!filteredProducts.length">
        No existen productos que coincidan con los criterios.
      </p>

      <table v-else>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Categoría</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="product in filteredProducts"
            :key="product.id"
          >
            <td>{{ product.id }}</td>
            <td>{{ product.name }}</td>
            <td>{{ product.price }}</td>
            <td>
              {{ getCategoryName(product.categoryId) }}
            </td>
            <td class="actions">
              <button
                type="button"
                :disabled="productStore.loading"
                @click="startEdit(product)"
              >
                Editar
              </button>

              <button
                type="button"
                :disabled="productStore.loading"
                @click="handleDelete(product.id)"
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
import { computed, onMounted, ref } from 'vue';

import { useCategoryStore } from '@/modules/categories/stores/categoryStore';
import { useProductStore } from '@/modules/products/stores/productStore';

import type { Product } from '@/infrastructure/rest/productApi';

const categoryStore = useCategoryStore();
const productStore = useProductStore();

const name = ref('');
const price = ref(0);
const categoryId = ref(0);

const editingId = ref<number | null>(null);

const search = ref('');
const selectedCategoryId = ref<number | ''>('');

const filteredProducts = computed(() => {
  const searchTerm = search.value.trim().toLowerCase();

  return productStore.products.filter((product) => {
    const matchesName =
      !searchTerm ||
      product.name.toLowerCase().includes(searchTerm);

    const matchesCategory =
      selectedCategoryId.value === '' ||
      product.categoryId === selectedCategoryId.value;

    return matchesName && matchesCategory;
  });
});

onMounted(async () => {
  await Promise.all([
    productStore.fetchProducts(),
    categoryStore.fetchCategories()
  ]);
});

function startCreate(): void {
  editingId.value = null;
  name.value = '';
  price.value = 0;
  categoryId.value = 0;
}

function startEdit(product: Product): void {
  editingId.value = product.id;
  name.value = product.name;
  price.value = product.price;
  categoryId.value = product.categoryId;
}

function cancelEdit(): void {
  editingId.value = null;
  name.value = '';
  price.value = 0;
  categoryId.value = 0;
}

async function handleSubmit(): Promise<void> {
  const productName = name.value.trim();

  if (!productName || price.value < 0 || categoryId.value === 0) {
    return;
  }

  const payload = {
    name: productName,
    price: price.value,
    categoryId: categoryId.value
  };

  if (editingId.value === null) {
    await productStore.createProduct(payload);
    cancelEdit();
    return;
  }

  await productStore.updateProduct(
    editingId.value,
    payload
  );

  cancelEdit();
}

async function handleDelete(id: number): Promise<void> {
  const confirmed = window.confirm(
    '¿Está seguro de eliminar este producto?'
  );

  if (!confirmed) {
    return;
  }

  await productStore.deleteProduct(id);

  if (editingId.value === id) {
    cancelEdit();
  }
}

function getCategoryName(categoryId: number): string {
  const category = categoryStore.categories.find(
    (item) => item.id === categoryId
  );

  return category?.name ?? 'Sin categoría';
}
</script>

<style scoped>
.products-view {
  padding: 2rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.filters .form-group {
  flex: 1;
}

.product-form {
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

.product-list table {
  width: 100%;
  border-collapse: collapse;
}

.product-list th,
.product-list td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.actions {
  display: flex;
  gap: 0.5rem;
}
</style>