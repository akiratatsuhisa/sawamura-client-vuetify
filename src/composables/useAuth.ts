import {
  createSharedComposable,
  MaybeRef,
  useLocalStorage,
} from '@vueuse/core';
import axios, { AxiosRequestConfig } from 'axios';
import dayjs from 'dayjs';
import _ from 'lodash';
import { computed, unref } from 'vue';
import { useRoute } from 'vue-router';

import { useAxios, useSnackbar } from '@/composables';
import { Jwt } from '@/helpers';
import {
  IAuthOptions,
  IAuthResponse,
  IdentityUser,
  ILoginRequest,
} from '@/interfaces';
import { config, services } from '@/services';

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

  function updateTokens(tokens: { accessToken: string; refreshToken: string }) {
    accessToken.value = tokens.accessToken;
    refreshToken.value = tokens.refreshToken;
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

      updateTokens(data);
    } catch (error) {
      updateTokens({
        accessToken: '',
        refreshToken: '',
      });
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
      updateTokens(data);

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
      updateTokens({
        accessToken: '',
        refreshToken: '',
      });
    }
  }

  async function oauthLogin(data: IAuthResponse) {
    updateTokens(data);
    createSnackbarSuccess('Login Successfully');
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
    oauthLogin,
    updateTokens,
    fetchAccessToken,
    getAccessTokenSilently,
    getUserSilently,
    photoUrl,
    coverUrl,
    updateImage,
  };
});

export function useOauth(isLinkProvider?: MaybeRef<boolean>) {
  const route = useRoute();

  const { excute: excuteLinkProvider } = useAxios(
    services.oauth,
    'linkProvider',
  );

  async function getState() {
    const isLink = unref(isLinkProvider);

    if (isLink) {
      const data = await excuteLinkProvider({});

      return {
        redirectUrl: route.fullPath,
        token: data.token,
      };
    } else {
      return {
        redirectUrl: _.isArray(route.query.redirectUrl)
          ? _.get(route.query.redirectUrl, '0', '/')
          : (route.query.redirectUrl as string) ?? '/',
      };
    }
  }

  async function challenge(rootUrl: string, options: Record<string, string>) {
    options.state = JSON.stringify(await getState());

    const qs = new URLSearchParams(options);
    const link = `${rootUrl}?${qs.toString()}`;
    window.location.href = link;
  }

  function challengeGoogleOauth() {
    const rootUrl = `https://accounts.google.com/o/oauth2/v2/auth`;
    const options = {
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      redirect_uri: import.meta.env.VITE_GOOGLE_CALLBACK_URL,
      access_type: 'offline',
      response_type: 'code',
      prompt: 'consent',
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
      ].join(' '),
    };

    challenge(rootUrl, options);
  }

  function challengeGithubOauth() {
    const rootUrl = `https://github.com/login/oauth/authorize`;
    const options = {
      client_id: import.meta.env.VITE_GITHUB_CLIENT_ID,
      redirect_uri: import.meta.env.VITE_GITHUB_CALLBACK_URL,
      scope: ['user:email', 'read:user'].join(' '),
      prompt: 'consent',
    };

    challenge(rootUrl, options);
  }

  const { excute: excuteUnlinkProvider, isLoading: isLoadingUnlinkProvider } =
    useAxios(services.oauth, 'unlinkProvider', {
      message: 'Unlink provider successfully',
    });

  async function linkProvider(provider: string) {
    switch (provider) {
      case 'google':
        return challengeGoogleOauth();
      case 'github':
        return challengeGithubOauth();
    }
  }

  async function unlinkProvider(provider: string) {
    await excuteUnlinkProvider({ provider });
  }

  return {
    linkProvider,
    unlinkProvider,
    isLoadingUnlinkProvider,
  };
}
