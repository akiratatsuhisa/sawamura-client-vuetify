import { MaybeRef } from '@vueuse/core';
import axios, {
  AxiosHeaders,
  AxiosProgressEvent,
  AxiosRequestConfig,
  AxiosResponse,
  isAxiosError,
} from 'axios';
import { Component, ref, unref } from 'vue';

import { useAuth, useSnackbar } from '@/composables';
import { IExceptionResponseDetail } from '@/interfaces';
import { config, Service } from '@/services';

export type UseAxiosOptions<T> = {
  unauth?: boolean;
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

  const { unauth, message } = options ?? {};

  const { getAccessTokenSilently } = useAuth();

  const { createSnackbarSuccess, createSnackbarError } = useSnackbar();

  const axiosInstacne = axios.create(config);

  const isLoading = ref<boolean>(false);
  const percent = ref<number>();

  const data = ref<Res>();
  const headers = ref<AxiosHeaders>(new AxiosHeaders());
  const error = ref<IExceptionResponseDetail>();

  function onProgress(event: AxiosProgressEvent) {
    percent.value = Math.round((event.loaded / (event.total ?? 0)) * 100);
  }

  async function excute(paramsOrData: Req): Promise<Res> {
    if (isLoading.value) {
      throw new Error('on progress');
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

      const content = unref(message);
      if (content) {
        createSnackbarSuccess(content);
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

      if (error.value?.message) {
        createSnackbarError(error.value.message);
      }

      throw exception;
    } finally {
      isLoading.value = false;
    }
  }

  if (options?.immediate) {
    excute(options.paramsOrData);
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
