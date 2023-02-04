import { useLocalStorage } from "@vueuse/core";
import axios, { AxiosRequestConfig } from "axios";
import _ from "lodash";
import moment from "moment";
import { computed } from "vue";

import { Jwt } from "@/helpers/jwt";
import {
  IAuthOptions,
  IAuthResponse,
  IdentityUser,
  ILoginRequest,
} from "@/interfaces/auth";
import { config } from "@/services";

export function useAuth() {
  const accessToken = useLocalStorage("accessToken", "");
  const refreshToken = useLocalStorage("refreshToken", "");

  const user = computed<IdentityUser | null>(() =>
    Jwt.parseUser(accessToken.value)
  );
  const expires = computed(() => Jwt.getExpires(accessToken.value));

  const isAuthenticated = computed(() => !_.isNull(user.value));
  const identityId = computed(() => user.value?.id ?? null);

  const axiosInstacne = axios.create(config);

  function isExpires(seconds: number = 60) {
    return (
      !expires.value ||
      moment(expires.value).subtract(seconds, "seconds").isBefore()
    );
  }

  async function getAccessTokenSilently(options?: IAuthOptions) {
    const { seconds, throw: throwError = true } = options ?? {};

    if (isExpires(seconds)) {
      try {
        const { data } = await axiosInstacne.post<IAuthResponse>(
          "/auth/refreshToken",
          undefined,
          {
            headers: {
              refreshToken: refreshToken.value,
            },
          }
        );

        accessToken.value = data.accessToken;
        refreshToken.value = data.refreshToken;
      } catch (error) {
        if (throwError) {
          throw error;
        }

        accessToken.value = "";
        refreshToken.value = "";
      }
    }

    return accessToken.value;
  }

  async function getUserSilently(options?: IAuthOptions) {
    if (isExpires(options?.seconds)) {
      await getAccessTokenSilently(options);
    }

    return user.value;
  }

  async function login(dto: ILoginRequest, config?: AxiosRequestConfig) {
    const { data } = await axiosInstacne.post<IAuthResponse>(
      "/auth/login",
      dto,
      { ...config }
    );

    accessToken.value = data.accessToken;
    refreshToken.value = data.refreshToken;
  }

  async function logout(config?: AxiosRequestConfig) {
    const value = refreshToken.value;
    const token = accessToken.value;

    accessToken.value = "";
    refreshToken.value = "";

    await axiosInstacne.patch<IAuthResponse>(
      "/auth/refreshToken",
      {
        value,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        ...config,
      }
    );
  }

  return {
    isAuthenticated,
    expires,
    user,
    identityId,
    login,
    logout,
    getAccessTokenSilently,
    getUserSilently,
  };
}
