import { ref } from 'vue';
import { defineStore } from 'pinia';

import productApi from '@/infrastructure/rest/productApi';
import { parseHttpError } from '@/core/http/errors';
import type {
  Product,
  ProductPayload
} from '@/infrastructure/rest/productApi';

export const useProductStore = defineStore('products', () => {
  const products = ref<Product[]>([]);
  const loading = ref(false);
  const errorMessage = ref('');

  async function fetchProducts(): Promise<void> {
    loading.value = true;
    errorMessage.value = '';

    try {
      products.value = await productApi.getAll();
    } catch (error: unknown) {
      errorMessage.value = parseHttpError(error).message;
    } finally {
      loading.value = false;
    }
  }

  async function createProduct(
    payload: ProductPayload
  ): Promise<Product> {
    loading.value = true;
    errorMessage.value = '';

    try {
      const product = await productApi.create(payload);

      products.value.push(product);

      return product;
    } catch (error: unknown) {
      errorMessage.value = parseHttpError(error).message;
      throw error;
    } finally {
      loading.value = false;
    }
  }

  async function updateProduct(
    id: number,
    payload: ProductPayload
  ): Promise<Product> {
    loading.value = true;
    errorMessage.value = '';

    try {
      const product = await productApi.update(id, payload);

      const index = products.value.findIndex(
        (item) => item.id === id
      );

      if (index !== -1) {
        products.value[index] = product;
      }

      return product;
    } catch (error: unknown) {
      errorMessage.value = parseHttpError(error).message;
      throw error;
    } finally {
      loading.value = false;
    }
  }

  async function deleteProduct(id: number): Promise<void> {
    loading.value = true;
    errorMessage.value = '';

    try {
      await productApi.remove(id);

      products.value = products.value.filter(
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
    products,
    loading,
    errorMessage,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct
  };
});