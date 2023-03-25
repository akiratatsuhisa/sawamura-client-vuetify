import { AxiosRequestConfig } from 'axios';

import {
  IForgotPasswordRequest,
  IForgotPasswordResponse,
  IRegisterRequest,
  IRegisterResponse,
  IResetPasswordRequest,
  IResetPasswordResponse,
} from '@/interfaces/auth';
import { Service } from '@/services/common';

export class AuthService extends Service {
  register(config: AxiosRequestConfig, data: IRegisterRequest) {
    return this.fetch<IRegisterResponse>({
      ...config,
      url: 'auth/register',
      method: 'POST',
      data,
    });
  }

  forgotPassword(config: AxiosRequestConfig, data: IForgotPasswordRequest) {
    return this.fetch<IForgotPasswordResponse>({
      ...config,
      url: 'auth/forgotPassword',
      method: 'POST',
      data,
    });
  }

  resetPassword(config: AxiosRequestConfig, data: IResetPasswordRequest) {
    return this.fetch<IResetPasswordResponse>({
      ...config,
      url: 'auth/resetPassword',
      method: 'POST',
      data,
    });
  }
}
