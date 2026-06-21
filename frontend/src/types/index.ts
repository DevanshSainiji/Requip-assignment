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
  secondaryMobile: string | null;
  pan: string;
  aadhaar: string;
  dateOfBirth: string | null;
  placeOfBirth: string;
  currentAddress: string;
  permanentAddress: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  deletedUsers: number;
  recentUsers: number;
}
