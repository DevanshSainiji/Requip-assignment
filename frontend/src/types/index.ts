export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  errors?: { field: string; message: string }[];
}

export interface User {
  id: number;
  name: string;
  email: string;
  primaryMobile: string;
  pan: string;
  aadhaar: string;
  dateOfBirth: string | null;
  createdAt: string;
  updatedAt: string;
}
