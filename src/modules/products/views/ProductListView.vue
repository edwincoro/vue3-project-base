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
        <label for="search"> Buscar por nombre </label>

        <input
          id="search"
          v-model="search"
          type="search"
          placeholder="Buscar producto..."
        />
      </div>

      <div class="form-group">
        <label for="category-filter"> Filtrar por categoría </label>

        <select id="category-filter" v-model="selectedCategoryId">
          <option value="">Todas las categorías</option>

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

    <div v-if="isFormVisible" class="modal-overlay" @click.self="cancelEdit">
      <section class="product-form">
        <div class="modal-header">
          <h2>
            {{ editingId === null ? "Nuevo producto" : "Editar producto" }}
          </h2>
          <button class="close-btn" @click="cancelEdit" aria-label="Cerrar">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label for="product-name">Nombre</label>
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
            <label for="product-price">Precio</label>
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
            <label for="product-category">Categoría</label>
            <select
              id="product-category"
              v-model="categoryId"
              required
              :disabled="productStore.loading"
            >
              <option :value="0" disabled>Seleccione una categoría</option>
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
            <button type="submit" :disabled="productStore.loading">
              {{
                productStore.loading
                  ? "Guardando..."
                  : editingId === null
                    ? "Crear"
                    : "Actualizar"
              }}
            </button>
            <button
              type="button"
              :disabled="productStore.loading"
              @click="cancelEdit"
            >
              Cancelar
            </button>
          </div>
        </form>
      </section>
    </div>

    <p v-if="productStore.errorMessage" class="error-message">
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
          <tr v-for="product in filteredProducts" :key="product.id">
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
import { computed, onMounted, ref } from "vue";

import { useCategoryStore } from "@/modules/categories/stores/categoryStore";
import { useProductStore } from "@/modules/products/stores/productStore";

import type { Product } from "@/infrastructure/rest/productApi";

const categoryStore = useCategoryStore();
const productStore = useProductStore();

const name = ref("");
const price = ref(0);
const categoryId = ref(0);

const editingId = ref<number | null>(null);
const isFormVisible = ref(false);

const search = ref("");
const selectedCategoryId = ref<number | "">("");

const filteredProducts = computed(() => {
  const searchTerm = search.value.trim().toLowerCase();

  return productStore.products.filter((product) => {
    const matchesName =
      !searchTerm || product.name.toLowerCase().includes(searchTerm);

    const matchesCategory =
      selectedCategoryId.value === "" ||
      product.categoryId === selectedCategoryId.value;

    return matchesName && matchesCategory;
  });
});

onMounted(async () => {
  await Promise.all([
    productStore.fetchProducts(),
    categoryStore.fetchCategories(),
  ]);
});

function startCreate(): void {
  editingId.value = null;
  name.value = "";
  price.value = 0;
  categoryId.value = 0;
  isFormVisible.value = true;
}

function startEdit(product: Product): void {
  editingId.value = product.id;
  name.value = product.name;
  price.value = product.price;
  categoryId.value = product.categoryId;
  isFormVisible.value = true;
}

function cancelEdit(): void {
  editingId.value = null;
  name.value = "";
  price.value = 0;
  categoryId.value = 0;
  isFormVisible.value = false;
}

async function handleSubmit(): Promise<void> {
  const productName = name.value.trim();

  if (!productName || price.value < 0 || categoryId.value === 0) {
    return;
  }

  const payload = {
    name: productName,
    price: price.value,
    categoryId: categoryId.value,
  };

  console.log("payload", payload);
  if (editingId.value === null) {
    await productStore.createProduct(payload);
    cancelEdit();
    return;
  }

  await productStore.updateProduct(editingId.value, payload);

  cancelEdit();
}

async function handleDelete(id: number): Promise<void> {
  const confirmed = window.confirm("¿Está seguro de eliminar este producto?");

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
    (item) => item.id === categoryId,
  );

  return category?.name ?? 'Sin categoría';
}
</script>

<style scoped>
.products-view {
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
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

.product-list,
.filters {
  background: #ffffff;
  border-radius: 16px;
  padding: 2rem;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.05),
    0 2px 4px -1px rgba(0, 0, 0, 0.03);
  margin-bottom: 2rem;
  border: 1px solid rgba(226, 232, 240, 0.8);
}

.filters {
  display: flex;
  gap: 1.5rem;
  align-items: center;
  padding: 1.5rem 2rem;
}

.filters .form-group {
  flex: 1;
  margin-bottom: 0;
}

.product-list h2 {
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

.product-form {
  background: #ffffff;
  border-radius: 16px;
  padding: 2rem;
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  width: 100%;
  max-width: 540px;
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
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

input,
select {
  padding: 0.75rem 1rem;
  border-radius: 10px;
  border: 1px solid #cbd5e1;
  background: #f8fafc;
  font-size: 1rem;
  color: #1e293b;
  transition: all 0.2s ease;
  outline: none;
}

input:focus,
select:focus {
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

button[type="submit"],
.page-header button {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
  box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.3);
}

button[type="submit"]:hover:not(:disabled),
.page-header button:hover:not(:disabled) {
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
