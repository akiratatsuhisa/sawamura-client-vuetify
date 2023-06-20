import { AxiosRequestConfig } from 'axios';

import {
  IConfirmEmailRequest,
  IConfirmEmailResponse,
  IForgotPasswordRequest,
  IForgotPasswordResponse,
  IRegisterRequest,
  IRegisterResponse,
  IResetPasswordRequest,
  IResetPasswordResponse,
} from '@/interfaces';
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

  confirmEmail(config: AxiosRequestConfig, data: IConfirmEmailRequest) {
    return this.fetch<IConfirmEmailResponse>({
      ...config,
      url: 'auth/confirmEmail',
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

  updatePhoto(
    config: AxiosRequestConfig,
    data: { image: File; theme: boolean },
  ) {
    const formData = new FormData();
    formData.append('image', data.image);

    return this.fetch<void>({
      ...config,
      url: 'auth/photo',
      method: 'PUT',
      data: formData,
      params: { theme: data.theme },
    });
  }

  updateCover(
    config: AxiosRequestConfig,
    data: { image: File; theme: boolean },
  ) {
    const formData = new FormData();
    formData.append('image', data.image);

    return this.fetch<void>({
      ...config,
      url: 'auth/cover',
      method: 'PUT',
      data: formData,
      params: { theme: data.theme },
    });
  }

  updateTheme(config: AxiosRequestConfig, data: { source: number | null }) {
    return this.fetch<void>({
      ...config,
      url: 'auth/theme',
      method: 'PATCH',
      data,
    });
  }

  exportProfilePdf(config: AxiosRequestConfig, _params: {}) {
    return this.fetch<Blob>({
      ...config,
      responseType: 'blob',
      url: 'auth/profile/pdf',
      method: 'GET',
    });
  }
}
