import httpClient from '@/core/http/httpClient';

export interface Category {
  id: number;
  name: string;
}

export interface CategoryPayload {
  name: string;
}

const categoryApi = {
  async getAll(): Promise<Category[]> {
    const { data } = await httpClient.get<Category[]>('/categories');

    return data;
  },

  async getById(id: number): Promise<Category> {
    const { data } = await httpClient.get<Category>(`/categories/${id}`);

    return data;
  },

  async create(payload: CategoryPayload): Promise<Category> {
    const { data } = await httpClient.post<Category>(
      '/categories',
      payload
    );

    return data;
  },

  async update(
    id: number,
    payload: CategoryPayload
  ): Promise<Category> {
    const { data } = await httpClient.put<Category>(
      `/categories/${id}`,
      payload
    );

    return data;
  },

  async remove(id: number): Promise<void> {
    await httpClient.delete(`/categories/${id}`);
  }
};

export default categoryApi;