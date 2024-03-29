export type IdentityUser = {
  id: string;
  username: string;
  displayName: string;
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
  displayName: string;
  email?: string | null;
  password: string;
}

export interface IRegisterResponse {
  id: string;
  username: string;
}

export interface IDeleteAccountRequest {}

export interface IDeleteAccountResponse {}

export interface IConfirmEmailRequest {
  token: string;
}

export interface IConfirmEmailResponse {
  username: string;
}

export interface IVerifyEmailRequest {}

export interface IVerifyEmailResponse {}

export interface IUpdateEmailRequest {
  email: string;
}

export interface IUpdateEmailResponse {}

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
