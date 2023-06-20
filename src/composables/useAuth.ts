import { createSharedComposable, useLocalStorage } from '@vueuse/core';
import axios, { AxiosRequestConfig } from 'axios';
import dayjs from 'dayjs';
import _ from 'lodash';
import { computed } from 'vue';

import { useSnackbar } from '@/composables';
import { Jwt } from '@/helpers';
import {
  IAuthOptions,
  IAuthResponse,
  IdentityUser,
  ILoginRequest,
} from '@/interfaces';
import { config } from '@/services';

export const useAuth = createSharedComposable(() => {
  const accessToken = useLocalStorage('auth:profile:accessToken', '');
  const refreshToken = useLocalStorage('auth:profile:refreshToken', '');

  const user = computed<IdentityUser | null>(() =>
    Jwt.parseUser(accessToken.value),
  );
  const expires = computed(() => Jwt.getExpires(accessToken.value));

  const isAuthenticated = computed(() => !_.isNull(user.value));
  const identityId = computed(() => user.value?.id ?? null);

  const axiosInstacne = axios.create(config);

  function isExpires(seconds: number = 60) {
    return (
      !expires.value ||
      dayjs(expires.value).subtract(seconds, 'seconds').isBefore()
    );
  }

  async function fetchAccessToken() {
    try {
      const { data } = await axiosInstacne.request<IAuthResponse>({
        url: '/auth/refreshToken',
        method: 'POST',
        headers: {
          ['Refresh-Token']: refreshToken.value,
        },
      });

      accessToken.value = data.accessToken;
      refreshToken.value = data.refreshToken;
    } catch (error) {
      accessToken.value = '';
      refreshToken.value = '';
    }
  }

  async function getAccessTokenSilently(options?: IAuthOptions) {
    const { seconds } = options ?? {};

    if (isExpires(seconds)) {
      await fetchAccessToken();
    }

    return accessToken.value;
  }

  async function getUserSilently(options?: IAuthOptions) {
    if (isExpires(options?.seconds)) {
      await getAccessTokenSilently(options);
    }

    return user.value;
  }

  const { createSnackbarSuccess, createSnackbarError } = useSnackbar();

  async function login(dto: ILoginRequest, config?: AxiosRequestConfig) {
    try {
      const { data } = await axiosInstacne.request<IAuthResponse>({
        url: '/auth/login',
        method: 'POST',
        data: dto,
        ...config,
      });

      accessToken.value = data.accessToken;
      refreshToken.value = data.refreshToken;

      createSnackbarSuccess('Login Successfully');
    } catch (error: any) {
      createSnackbarError(error?.response?.data?.message ?? 'Error');
    }
  }

  async function logout(config?: AxiosRequestConfig) {
    try {
      createSnackbarSuccess('Logout Successfully');

      await axiosInstacne.request<IAuthResponse>({
        url: '/auth/refreshToken',
        method: 'PATCH',
        data: {
          value: refreshToken.value,
        },
        headers: {
          Authorization: `Bearer ${accessToken.value}`,
        },
        ...config,
      });
    } catch (error: any) {
      createSnackbarError(error?.response?.data?.message ?? 'Error');
    } finally {
      accessToken.value = '';
      refreshToken.value = '';
    }
  }

  const updatedImages = useLocalStorage('auth:profile:images', {
    photo: '',
    cover: '',
  });

  const photoUrl = computed(() =>
    user.value?.photoUrl
      ? `${import.meta.env.VITE_API_URL}/auth/photo?username=${
          user.value.username
        }` +
        (updatedImages.value.photo
          ? `&updated=${updatedImages.value.photo}`
          : '')
      : import.meta.env.VITE_NO_AVATAR_URL,
  );

  const coverUrl = computed(() =>
    user.value?.coverUrl
      ? `${import.meta.env.VITE_API_URL}/auth/cover?username=${
          user.value.username
        }` +
        (updatedImages.value.cover
          ? `&updated=${updatedImages.value.cover}`
          : '')
      : import.meta.env.VITE_NO_BACKGROUND_URL,
  );

  function updateImage(type: 'photo' | 'cover') {
    updatedImages.value[type] = dayjs().unix().toString();
  }

  return {
    isAuthenticated,
    expires,
    user,
    identityId,
    login,
    logout,
    fetchAccessToken,
    getAccessTokenSilently,
    getUserSilently,
    photoUrl,
    coverUrl,
    updateImage,
  };
});
