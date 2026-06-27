const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: {
    message: string;
    code: string;
    details?: any[];
  };
}

export class ApiError extends Error {
  code: string;
  details?: any[];

  constructor(message: string, code: string, details?: any[]) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.details = details;
  }
}

/**
 * Clean wrapper around fetch for communicating with the monolithic backend.
 * Automatically forwards HttpOnly session cookies via credentials: 'include'.
 */
export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
  
  const headers = new Headers(options.headers);
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(url, {
    credentials: 'include',
    ...options,
    headers,
  });

  const payload = (await response.json()) as ApiResponse<T>;

  if (!response.ok || !payload.success) {
    const errorMsg = payload.error?.message || `HTTP error! status: ${response.status}`;
    const errorCode = payload.error?.code || 'UNKNOWN_ERROR';
    throw new ApiError(errorMsg, errorCode, payload.error?.details);
  }

  return payload.data;
}
