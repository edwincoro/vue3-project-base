import httpClient from '@/core/http/httpClient';

export interface Product {
  id: number;
  name: string;
  price: number;
  categoryId: number;
}

export interface ProductPayload {
  name: string;
  price: number;
  categoryId: number;
}

const productApi = {
  async getAll(): Promise<Product[]> {
    const { data } = await httpClient.get<Product[]>('/products');

    return data;
  },

  async getById(id: number): Promise<Product> {
    const { data } = await httpClient.get<Product>(`/products/${id}`);

    return data;
  },

  async create(payload: ProductPayload): Promise<Product> {
    const { data } = await httpClient.post<Product>(
      '/products',
      payload
    );

    return data;
  },

  async update(
    id: number,
    payload: ProductPayload
  ): Promise<Product> {
    const { data } = await httpClient.put<Product>(
      `/products/${id}`,
      payload
    );

    return data;
  },

  async remove(id: number): Promise<void> {
    await httpClient.delete(`/products/${id}`);
  }
};

export default productApi;