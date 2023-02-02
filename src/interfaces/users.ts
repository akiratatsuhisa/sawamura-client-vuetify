export interface UserResponse {}

export interface SearchUsersRequest {
  search?: string;
}

export interface UserResponse {
  id: string;
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  salary: string;
  createdAt: string;
  updatedAt: string;
  userRoles: Array<{
    role: {
      name: string;
    };
  }>;
}
