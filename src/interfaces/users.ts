export interface ISearchUsersRequest {
  username?: string | null;
  name?: string | null;
  email?: string | null;
  emailStates?: Array<string> | null;
  roleIds?: Array<string> | null;
  roleMode?: string | null;
  sort?: { field: string; order: string } | null;
  skip?: string;
  take?: string;
}

export interface IUserRequest {
  id: string;
}

export interface IUserResponse {
  id: string;
  username: string;
  displayName: string | null;
  email: string | null;
  emailConfirmed: boolean;
  firstName: string | null;
  lastName: string | null;
  birthDate: string | null;
  location: string | null;
  salary: string | null;
  biography: string | null;
  websiteLink: string | null;
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

export interface IChangeUserRolesRequest {
  id: string;
  roleIds: Array<string>;
}

export interface IChangeUserRolesResponse {}
