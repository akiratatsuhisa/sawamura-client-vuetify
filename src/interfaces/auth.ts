export type IdentityUser = {
  id: string | null;
  username: string | null;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  birthDate: string | null;
  salary: number | null;
  roles: string[] | null;
};

export interface IAuthOptions {
  seconds?: number;
  throw?: boolean;
}

export interface ILoginRequest {
  username: string;
  password: string;
}

export interface IAuthResponse {
  accessToken: string;
  refreshToken: string;
}
