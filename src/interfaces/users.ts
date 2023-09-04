export interface ISearchAdvancedUsersRequest {
  search?: string;
}

export interface IAdvancedUserResponse {
  id: string;
  username: string;
  displayName: string | null;
  firstName: string | null;
  lastName: string | null;
  photoUrl: string | null;
  coverUrl: string | null;
  themeSource: number | null;
  themeStyle: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ISearchProfileUserRequest {
  username: string;
}

export interface IProfileUserResponse {
  id: string;
  username: string;
  displayName: string | null;
  firstName: string | null;
  lastName: string | null;
  birthDate: string | null;
  location: string | null;
  salary: string | null;
  biography: string | null;
  websiteLink: string | null;
  photoUrl: string | null;
  coverUrl: string | null;
  themeSource: string | null;
  themeStyle: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  _count: {
    followers: number;
    followees: number;
  };
}

export interface IChangeUserRolesRequest {
  id: string;
  roleIds: Array<string>;
}

export interface IUserRequest {
  id: string;
}

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

export enum UserRelationshipState {
  Follow = 'follow',
  Unfollow = 'unfollow',
}

export interface IChangeUserRelationshipRequest {
  username: string;
  relationshipState: UserRelationshipState;
}
