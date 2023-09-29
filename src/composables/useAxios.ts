import { MaybeRef } from '@vueuse/core';
import axios, {
  AxiosHeaders,
  AxiosProgressEvent,
  AxiosRequestConfig,
  AxiosResponse,
  isAxiosError,
} from 'axios';
import { Component, ref, unref } from 'vue';

import {
  useAuth,
  useLayoutLocale,
  useLoading,
  useSnackbar,
} from '@/composables';
import { LoadingState } from '@/constants';
import { IExceptionResponseDetail } from '@/interfaces';
import { config, Service } from '@/services';

export type UseAxiosOptions<T> = {
  unauth?: boolean;
  loadingState?: LoadingState;
  delayPercentFinished?: number;

  displayMessageFromResponse?: boolean;
  displayMessageFromException?: boolean;
  translateMessage?: MaybeRef<string>;
  translateMessageParams?: MaybeRef<Record<string, any> | Array<any>>;
  message?: MaybeRef<Component | string>;
} & (
  | {
      immediate: true;
      paramsOrData: T;
    }
  | {
      immediate?: false;
    }
);

export function useAxios<
  S extends Record<
    A,
    (config: AxiosRequestConfig, dataOrParams: any) => Promise<any>
  > &
    Service,
  A extends Exclude<keyof S, keyof Service>,
>(service: S, action: A, options?: UseAxiosOptions<Parameters<S[A]>['1']>) {
  type Req = Parameters<S[A]>['1'];
  type Res = Awaited<ReturnType<S[A]>>['data'];

  const {
    unauth,
    loadingState = LoadingState.Loading,
    delayPercentFinished = 0,
    displayMessageFromResponse = false,
    displayMessageFromException = true,
    translateMessage,
    translateMessageParams,
    message,
  } = options ?? {};

  const { getAccessTokenSilently } = useAuth();

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

  async function excute(paramsOrData: Req): Promise<Res> {
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
        paramsOrData,
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
          color: message.split('.')[0],
        });
      } else if (unwrapTranslateMessage) {
        const unwrapTranslateParams = unref(translateMessageParams);

        createSnackbar(
          t(
            `common.messages.${unwrapTranslateMessage}`,
            unwrapTranslateParams as any,
          ),
          { isOnce: true, color: unwrapTranslateMessage.split('.')[0] },
        );
      } else if (unwrapMessage) {
        createSnackbarSuccess(unwrapMessage);
      }

      return response.data;
    } catch (exception: unknown) {
      percent.value = undefined;
      data.value = undefined;
      if (isAxiosError(exception)) {
        error.value = exception.response?.data as IExceptionResponseDetail;
        headers.value = exception.response?.headers as AxiosHeaders;
      } else {
        error.value = undefined;
        headers.value = new AxiosHeaders();
      }

      if (displayMessageFromException && error.value?.message) {
        const params = error.value.params;
        createSnackbar(
          t(`common.messages.${error.value.message}`, params as any),
          { isOnce: true, color: error.value.message.split('.')[0] },
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

  if (options?.immediate) {
    excute(options.paramsOrData);
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
    excute,
  };
}
