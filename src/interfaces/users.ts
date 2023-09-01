export interface ISearchUsersRequest {
  search?: string;
}

export interface IUserResponse {
  id: string;
  username: string;
  password: string | null;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  birthDate: string | null;
  salary: string | null;
  createdAt: string;
  updatedAt: string;
  userRoles: Array<{
    role: {
      name: string;
    };
  }>;
}
export interface ISearchAdvancedUsersRequest {
  username?: string | null;
  name?: string | null;
  email?: string | null;
  emailStates?: Array<string> | null;
  roleIds?: Array<string> | null;
  sort?: { field: string; order: string } | null;
  take?: string | null;
  offset?: string | null;
}

export interface IAdvancedUserResponse {
  id: string;
  username: string;
  email: string | null;
  emailConfirmed: boolean;
  firstName: string | null;
  lastName: string | null;
  birthDate: string | null;
  salary: number | null;
  photoUrl: string | null;
  coverUrl: string | null;
  createdAt: string;
  updatedAt: string;
  userRoles: Array<{
    role: {
      name: string;
    };
  }>;
}
