import axios from 'axios';

export interface HttpError {
  status: number | null;
  message: string;
}

export function parseHttpError(error: unknown): HttpError {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status ?? null;

    const message =
      error.response?.data?.message ??
      error.response?.data ??
      error.message;

    return {
      status,
      message: typeof message === 'string'
        ? message
        : 'Ocurrió un error en la solicitud.'
    };
  }

  if (error instanceof Error) {
    return {
      status: null,
      message: error.message
    };
  }

  return {
    status: null,
    message: 'Ocurrió un error inesperado.'
  };
}