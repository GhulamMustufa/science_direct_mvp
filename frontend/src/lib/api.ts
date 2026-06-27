const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  pagination?: {
    total: number;
    limit: number;
    offset: number;
  };
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
 * Advanced wrapper around fetch that returns the full response envelope containing metadata.
 */
export async function apiFetchWithMeta<T>(path: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
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

  return payload;
}

/**
 * Clean wrapper around fetch that extracts the payload data directly.
 */
export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const payload = await apiFetchWithMeta<T>(path, options);
  return payload.data;
}
