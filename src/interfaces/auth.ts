export type IdentityUser = {
  id: string | null;
  username: string | null;
  hasPassword: boolean | null;
  email: string | null;
  emailConfirmed: boolean | null;
  firstName: string | null;
  lastName: string | null;
  birthDate: string | null;
  salary: number | null;
  roles: string[] | null;
  photoUrl: string | null;
  coverUrl: string | null;
  themeSource: number | null;
  themeStyle: string | null;
};

export interface IAuthOptions {
  seconds?: number;
}

export interface ILoginRequest {
  username: string;
  password: string;
}

export interface IAuthResponse {
  accessToken: string;
  refreshToken: string;
}

export interface IRegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface IRegisterResponse {
  id: string;
  username: string;
}

export interface IDeleteAccountRequest {}

export interface IDeleteAccountResponse {}

export interface IUpdateEmailRequest {
  email: string;
}

export interface IConfirmEmailRequest {
  token: string;
}

export interface IVerifyEmailRequest {}

export interface IConfirmEmailResponse {
  username: string;
}

export interface IUpdatePasswordRequest {
  currentPassword?: string | null;
  newPassword: string;
}

export interface IForgotPasswordRequest {
  username: string;
}

export interface IForgotPasswordResponse {
  email: string;
}

export interface IResetPasswordRequest {
  token: string;
  password: string;
}

export interface IResetPasswordResponse {
  username: string;
}
