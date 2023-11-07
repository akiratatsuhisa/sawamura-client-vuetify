import {
  computedAsync,
  createSharedComposable,
  MaybeRef,
  useLocalStorage,
} from '@vueuse/core';
import axios, { AxiosRequestConfig } from 'axios';
import dayjs from 'dayjs';
import _ from 'lodash';
import { computed, nextTick, reactive, ref, unref } from 'vue';
import { useRoute } from 'vue-router';

import {
  ThemeModeType,
  ThemeStyleType,
  useAxios,
  useSnackbar,
  useThemeModeStorage,
  useThemeStyleStorage,
} from '@/composables';
import { Jwt } from '@/helpers';
import {
  IAuthOptions,
  IAuthResponse,
  IdentityUser,
  ILoginRequest,
} from '@/interfaces';
import i18n from '@/locales';
import { config, services } from '@/services';

const NO_AVATAR_URL = import.meta.env.VITE_NO_AVATAR_URL as string;
const NO_BACKGROUND_URL = import.meta.env.VITE_NO_BACKGROUND_URL as string;

export const useAuth = createSharedComposable(() => {
  const cacheImages: Record<
    'photo' | 'cover',
    | { url: string; promise: Promise<string> }
    | { url: null; promise: undefined }
  > = {
    photo: { url: null, promise: undefined },
    cover: { url: null, promise: undefined },
  };

  const accessToken = useLocalStorage('auth:profile:accessToken', '');
  const refreshToken = useLocalStorage('auth:profile:refreshToken', '');

  const user = computed<IdentityUser | null>(() =>
    Jwt.parseUser(accessToken.value),
  );
  const expires = computed(() => Jwt.getExpires(accessToken.value));

  const isAuthenticated = computed(() => !_.isNull(user.value));
  const identityId = computed(() => user.value?.id ?? null);

  function hasRoles(...roles: Array<string>) {
    return _.some(roles, (role) => _.includes(user.value?.roles, role));
  }

  const axiosInstacne = axios.create(config);

  function isExpires(seconds: number = 60) {
    return (
      !expires.value ||
      dayjs(expires.value).subtract(seconds, 'seconds').isBefore()
    );
  }

  function updateTokens(tokens: { accessToken: string; refreshToken: string }) {
    // clear cache images
    cacheImages.cover = {
      url: null,
      promise: undefined,
    };
    cacheImages.photo = {
      url: null,
      promise: undefined,
    };

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

  const isFetchingAccessToken = ref(false);

  async function getAccessTokenSilently(options?: IAuthOptions) {
    const { seconds } = options ?? {};

    if (!isExpires(seconds)) {
      return accessToken.value;
    }

    if (!isFetchingAccessToken.value) {
      console.debug('auth:fetching access token');
      try {
        isFetchingAccessToken.value = true;
        await fetchAccessToken();
      } finally {
        await nextTick();
        isFetchingAccessToken.value = false;
      }
    } else {
      // wait until fetch access token completed
      console.debug('auth:waiting access token');
      while (isFetchingAccessToken.value) {
        await new Promise((resolve) => _.delay(resolve, 200));
      }
      console.debug('auth:waiting access token completed');
    }

    return accessToken.value;
  }

  async function getUserSilently(options?: IAuthOptions) {
    if (isExpires(options?.seconds)) {
      await getAccessTokenSilently(options);
    }

    return user.value;
  }

  const { createSnackbarNormal, createSnackbarSuccess, createSnackbarError } =
    useSnackbar();

  async function login(dto: ILoginRequest, config?: AxiosRequestConfig) {
    try {
      const { data } = await axiosInstacne.request<IAuthResponse>({
        url: '/auth/login',
        method: 'POST',
        data: dto,
        ...config,
      });
      updateTokens(data);

      createSnackbarSuccess(i18n.global.t('common.messages.success.login'));
    } catch (error: any) {
      const data = error?.response?.data;
      if (data && data.message) {
        createSnackbarError(
          i18n.global.t(`common.messages.${data.message}`, data.params as any),
        );
      } else {
        createSnackbarNormal(i18n.global.t(`common.messages.error.unknown`));
      }
    }
  }

  async function logout(config?: AxiosRequestConfig) {
    try {
      createSnackbarSuccess(i18n.global.t('common.messages.success.logout'));

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
      const data = error?.response?.data;
      if (data && data.message) {
        createSnackbarError(
          i18n.global.t(`common.messages.${data.message}`, data.params as any),
        );
      } else {
        createSnackbarNormal(i18n.global.t(`common.messages.error.unknown`));
      }
    } finally {
      updateTokens({
        accessToken: '',
        refreshToken: '',
      });
    }
  }

  async function oauthLogin({
    provider,
    params,
  }: {
    provider: string;
    params?: Record<string, any>;
  }) {
    const { data } = await axiosInstacne.get<IAuthResponse>(
      `/oauth/${provider}`,
      {
        params,
      },
    );

    updateTokens(data);
    createSnackbarSuccess(i18n.global.t('common.messages.success.login'));
  }

  const fullName = computed(() =>
    _.trim(`${user.value?.lastName ?? ''} ${user.value?.firstName ?? ''}`),
  );

  async function requestImageByType(username: string, type: 'photo' | 'cover') {
    return axiosInstacne
      .request<string>({
        url: `/profileUsers/${username}/${type}`,
      })
      .then((data) => data.data)
      .catch(() => (type === 'photo' ? NO_AVATAR_URL : NO_BACKGROUND_URL));
  }

  const photoUrl = computedAsync(async () => {
    if (!user.value || !user.value?.photoUrl) {
      return NO_AVATAR_URL;
    }

    if (cacheImages.photo.url === user.value.photoUrl) {
      return await cacheImages.photo.promise;
    }

    cacheImages.photo = {
      url: user.value.photoUrl,
      promise: requestImageByType(user.value.username, 'photo'),
    };
    return await cacheImages.photo.promise;
  }, NO_AVATAR_URL);
  const coverUrl = computedAsync(async () => {
    if (!user.value || !user.value?.coverUrl) {
      return NO_BACKGROUND_URL;
    }

    if (cacheImages.cover.url === user.value.coverUrl) {
      return await cacheImages.cover.promise;
    }

    cacheImages.cover = {
      url: user.value.coverUrl,
      promise: requestImageByType(user.value.username, 'cover'),
    };
    return await cacheImages.cover.promise;
  }, NO_BACKGROUND_URL);

  return {
    isAuthenticated,
    expires,
    user,
    identityId,
    hasRoles,
    login,
    logout,
    oauthLogin,
    updateTokens,
    fetchAccessToken,
    getAccessTokenSilently,
    getUserSilently,
    fullName,
    photoUrl,
    coverUrl,
  };
});

export type ProviderType = 'google' | 'github';

export function useOauth(isLinkProvider?: MaybeRef<boolean>) {
  const route = useRoute();

  const providers = reactive<
    Record<ProviderType, { name: string; image: string }>
  >({
    google: { name: 'google', image: '/logos/google.svg' },
    github: { name: 'github', image: '/logos/github.svg' },
  });

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
      translateMessage: 'success.oauthUnlink',
    });

  function linkProvider(provider: string) {
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
    providers,
    linkProvider,
    unlinkProvider,
    isLoadingUnlinkProvider,
  };
}

export function useIsAuthThemeSelectable() {
  const { selectedThemeStyle } = useThemeStyleStorage();
  const { selectedThemeMode } = useThemeModeStorage();

  return computed(
    () =>
      (['default', 'mixed', 'override'] as Array<ThemeStyleType>).includes(
        selectedThemeStyle.value,
      ) &&
      (['light', 'dark'] as Array<ThemeModeType>).includes(
        selectedThemeMode.value,
      ),
  );
}
