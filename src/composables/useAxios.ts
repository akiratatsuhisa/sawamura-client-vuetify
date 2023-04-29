import axios, {
  AxiosHeaders,
  AxiosProgressEvent,
  AxiosRequestConfig,
} from 'axios';
import { ref } from 'vue';

import { IExceptionResponseDetail } from '@/interfaces/error';
import { config, Service } from '@/services';

import { useAuth } from './useAuth';

export type UseAxiosOptions<T> = { unauth?: boolean } & (
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

  const { unauth } = options ?? {};

  const { getAccessTokenSilently } = useAuth();

  const axiosInstacne = axios.create(config);

  const isLoading = ref<boolean>(false);
  const percent = ref<number>();

  const data = ref<Res>();
  const error = ref<IExceptionResponseDetail>();

  function onProgress(event: AxiosProgressEvent) {
    percent.value = Math.round((event.loaded / (event.total ?? 0)) * 100);
  }

  async function excute<T extends Req>(paramsOrData: T): Promise<Res> {
    if (isLoading.value) {
      throw new Error('on progress');
    }

    isLoading.value = true;
    percent.value = 0;

    try {
      const token = unauth ? undefined : await getAccessTokenSilently();

      const fetcher = service.setFetcher(axiosInstacne);

      const headers = new AxiosHeaders();
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }

      const response = await fetcher[action](
        {
          headers,
          onUploadProgress: onProgress,
          onDownloadProgress: onProgress,
        },
        paramsOrData,
      );

      error.value = undefined;
      data.value = response.data === '' ? undefined : response.data;

      return response.data;
    } catch (exception: any) {
      percent.value = undefined;

      error.value = exception.response.data as IExceptionResponseDetail;
      data.value = undefined;

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
    excute,
  };
}
