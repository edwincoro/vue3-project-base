import { ref } from 'vue';
import { defineStore } from 'pinia';

import categoryApi from '@/infrastructure/rest/categoryApi';
import { parseHttpError } from '@/core/http/errors';
import type {
  Category,
  CategoryPayload
} from '@/infrastructure/rest/categoryApi';

export const useCategoryStore = defineStore('categories', () => {
  const categories = ref<Category[]>([]);
  const loading = ref(false);
  const errorMessage = ref('');

  async function fetchCategories(): Promise<void> {
    loading.value = true;
    errorMessage.value = '';

    try {
      categories.value = await categoryApi.getAll();
    } catch (error: unknown) {
      errorMessage.value = parseHttpError(error).message;
    } finally {
      loading.value = false;
    }
  }

  async function createCategory(
    payload: CategoryPayload
  ): Promise<Category> {
    loading.value = true;
    errorMessage.value = '';

    try {
      const category = await categoryApi.create(payload);

      categories.value.push(category);

      return category;
    } catch (error: unknown) {
      errorMessage.value = parseHttpError(error).message;
      throw error;
    } finally {
      loading.value = false;
    }
  }

  async function updateCategory(
    id: number,
    payload: CategoryPayload
  ): Promise<Category> {
    loading.value = true;
    errorMessage.value = '';

    try {
      const category = await categoryApi.update(id, payload);

      const index = categories.value.findIndex(
        (item) => item.id === id
      );

      if (index !== -1) {
        categories.value[index] = category;
      }

      return category;
    } catch (error: unknown) {
      errorMessage.value = parseHttpError(error).message;
      throw error;
    } finally {
      loading.value = false;
    }
  }

  async function deleteCategory(id: number): Promise<void> {
    loading.value = true;
    errorMessage.value = '';

    try {
      await categoryApi.remove(id);

      categories.value = categories.value.filter(
        (item) => item.id !== id
      );
    } catch (error: unknown) {
      errorMessage.value = parseHttpError(error).message;
      throw error;
    } finally {
      loading.value = false;
    }
  }

  return {
    categories,
    loading,
    errorMessage,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory
  };
});