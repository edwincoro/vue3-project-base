import httpClient from '@/core/http/httpClient';

export interface RegisterPayload {
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthUser {
  id: number;
  email: string;
}

export interface AuthResponse {
  accessToken: string;
  user: AuthUser;
}

const authApi = {
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const { data } = await httpClient.post<AuthResponse>(
      '/register',
      payload
    );

    return data;
  },

  async login(payload: LoginPayload): Promise<AuthResponse> {
    const { data } = await httpClient.post<AuthResponse>(
      '/login',
      payload
    );

    return data;
  }
};

export default authApi;