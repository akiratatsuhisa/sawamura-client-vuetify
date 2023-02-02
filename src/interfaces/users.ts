export interface IUserResponse {}

export interface ISearchUsersRequest {
  search?: string;
}

export interface IUserResponse {
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
