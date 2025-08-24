export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  password?: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password?: string;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  password?: string;
}
