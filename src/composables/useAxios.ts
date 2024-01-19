import { MaybeRef } from '@vueuse/core';
import axios, {
  AxiosHeaders,
  AxiosProgressEvent,
  AxiosRequestConfig,
  AxiosResponse,
  HttpStatusCode,
  isAxiosError,
} from 'axios';
import _ from 'lodash';
import { Component, ref, unref } from 'vue';
import { useRouter } from 'vue-router';

import {
  useAuth,
  useLayoutLocale,
  useLifecycleState,
  useLoading,
  useSnackbar,
} from '@/composables';
import { LoadingState } from '@/constants';
import { IExceptionResponseDetail } from '@/interfaces';
import { config, Service } from '@/services';

type OmitFirstArg<F> = F extends (
  config: AxiosRequestConfig,
  ...params: infer P
) => Promise<AxiosResponse<infer R>>
  ? (...params: P) => Promise<R>
  : never;

export type UseAxiosOptions<Req> = {
  unauth?: boolean;
  loadingState?: LoadingState;
  delayPercentFinished?: number;

  displayMessageFromResponse?: boolean;
  displayMessageFromException?: boolean;
  autoRedirectByHttpStatus?: Array<HttpStatusCode>;
  translateMessage?: MaybeRef<string>;
  translateMessageParams?: MaybeRef<Record<string, any> | Array<any>>;
  message?: MaybeRef<Component | string>;
} & (
  | {
      immediate: true;
      paramsOrData: Req;
    }
  | {
      immediate?: false;
    }
);

export function useAxios<
  S extends Record<
    A,
    (config: AxiosRequestConfig, ...dataOrParams: any) => Promise<any>
  > &
    Service,
  A extends Exclude<keyof S, keyof Service>,
  Req extends Parameters<OmitFirstArg<S[A]>>,
  Res extends Awaited<ReturnType<OmitFirstArg<S[A]>>>,
>(service: S, action: A, options: UseAxiosOptions<Req> = {}) {
  const {
    unauth,
    loadingState = LoadingState.Loading,
    delayPercentFinished = 0,
    displayMessageFromResponse = false,
    displayMessageFromException = true,
    autoRedirectByHttpStatus = [
      HttpStatusCode.Unauthorized,
      HttpStatusCode.Forbidden,
      HttpStatusCode.NotFound,
      HttpStatusCode.InternalServerError,
    ],
    translateMessage,
    translateMessageParams,
    message,
  } = options;

  const { getAccessTokenSilently } = useAuth();

  const { isMounted } = useLifecycleState();
  const router = useRouter();

  const { t } = useLayoutLocale({ prefix: 'default' });
  const { createSnackbar, createSnackbarSuccess } = useSnackbar();

  const axiosInstacne = axios.create(config);

  const isLoading = ref<boolean>(false);
  const percent = ref<number>();

  const data = ref<Res>();
  const headers = ref<AxiosHeaders>(new AxiosHeaders());
  const error = ref<IExceptionResponseDetail>();

  function onProgress(event: AxiosProgressEvent) {
    percent.value = Math.round((event.loaded / (event.total ?? 0)) * 100);
  }

  let percentTimeout: NodeJS.Timeout;

  async function request(...paramsOrData: Req): Promise<Res> {
    if (isLoading.value) {
      throw new Error('on progress');
    }
    if (percentTimeout) {
      clearTimeout(percentTimeout);
    }

    isLoading.value = true;
    percent.value = 0;

    try {
      const token = unauth ? undefined : await getAccessTokenSilently();

      const fetcher = service.setFetcher(axiosInstacne);

      const requestHeaders = new AxiosHeaders();
      if (token) {
        requestHeaders.set('Authorization', `Bearer ${token}`);
      }

      const response = (await fetcher[action](
        {
          headers: requestHeaders,
          onUploadProgress: onProgress,
          onDownloadProgress: onProgress,
        },
        ...(paramsOrData as any),
      )) satisfies AxiosResponse<Res>;

      data.value = response.data === '' ? undefined : response.data;
      headers.value = response.headers;
      error.value = undefined;

      const unwrapTranslateMessage = unref(translateMessage);
      const unwrapMessage = unref(message);

      if (
        displayMessageFromResponse &&
        typeof response.data.message === 'string'
      ) {
        const { message, params } = response.data;

        createSnackbar(t(`common.messages.${message}`, params as any), {
          isOnce: true,
          color: _.first(message.split('.')),
        });
      } else if (unwrapTranslateMessage) {
        const unwrapTranslateParams = unref(translateMessageParams);

        createSnackbar(
          t(
            `common.messages.${unwrapTranslateMessage}`,
            unwrapTranslateParams as any,
          ),
          { isOnce: true, color: _.first(unwrapTranslateMessage.split('.')) },
        );
      } else if (unwrapMessage) {
        createSnackbarSuccess(unwrapMessage);
      }

      return response.data;
    } catch (exception: unknown) {
      percent.value = undefined;
      data.value = undefined;
      if (!isAxiosError<IExceptionResponseDetail>(exception)) {
        error.value = undefined;
        headers.value = new AxiosHeaders();

        throw exception;
      }

      error.value = exception.response!.data;
      headers.value = exception.response!.headers as AxiosHeaders;

      const isAutoRedirect = _.includes(
        autoRedirectByHttpStatus,
        exception.response?.status ?? 500,
      );

      if (isAutoRedirect && isMounted.value) {
        switch (exception.response!.status) {
          case HttpStatusCode.Unauthorized:
            router.push({
              name: 'Login',
              query: { redirectUrl: router.currentRoute.value.fullPath },
            });
            break;
          case HttpStatusCode.Forbidden:
            router.push({
              name: 'AccessDenied',
            });
            break;
          case HttpStatusCode.NotFound:
            router.push({
              name: 'NotFound',
            });
            break;
          case HttpStatusCode.InternalServerError:
          default:
            router.push({
              name: 'InternalServer',
            });
            break;
        }
        throw exception;
      }

      if (
        !isAutoRedirect &&
        displayMessageFromException &&
        error.value?.message
      ) {
        const params = error.value.params;
        createSnackbar(
          t(`common.messages.${error.value.message}`, params as any),
          { isOnce: true, color: _.first(error.value.message.split('.')) },
        );
      }

      throw exception;
    } finally {
      isLoading.value = false;
      percentTimeout = setTimeout(
        () => (percent.value = undefined),
        delayPercentFinished,
      );
    }
  }

  if (options.immediate) {
    request(...options.paramsOrData);
  }

  switch (loadingState) {
    case LoadingState.Loading:
      useLoading(isLoading);
      break;
    case LoadingState.Percent:
      useLoading(percent);
      break;
    case LoadingState.None:
    default:
      break;
  }

  return {
    isLoading,
    percent,
    data,
    error,
    headers,
    request,
  };
}
