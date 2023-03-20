import axios, {
  AxiosHeaders,
  AxiosProgressEvent,
  AxiosRequestConfig,
} from 'axios';
import { ref } from 'vue';

import { IExceptionResponseDetail } from '@/interfaces/error';
import { config, Service } from '@/services';

import { useAuth } from './useAuth';

export function useAxios<
  S extends Record<
    A,
    (config: AxiosRequestConfig, dataOrParams: any) => Promise<any>
  > &
    Service,
  A extends Exclude<keyof S, keyof Service>,
>(service: S, action: A, options?: { unauth: boolean }) {
  type Req = Parameters<S[A]>['1'];
  type Res = ReturnType<S[A]>;

  const { unauth } = options ?? {};

  const { getAccessTokenSilently } = useAuth();

  const axiosInstacne = axios.create(config);

  const isLoading = ref<boolean>(false);
  const percent = ref<number>(0);

  const data = ref<Res | null>(null);
  const error = ref<IExceptionResponseDetail | null>(null);

  function onProgress(event: AxiosProgressEvent) {
    percent.value = Math.round((event.loaded / (event.total ?? 0)) * 100);
  }

  async function excute<T extends Req>(paramsOrData: T): Promise<Res> {
    if (isLoading.value) {
      throw new Error('on progress');
    }

    try {
      isLoading.value = true;
      percent.value = 0;

      const token = unauth ? undefined : await getAccessTokenSilently();

      const fetcher = service.setFetcher(axiosInstacne);

      const headers = new AxiosHeaders();
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }

      const data = await fetcher[action](
        {
          headers,
          onUploadProgress: onProgress,
          onDownloadProgress: onProgress,
        },
        paramsOrData,
      );

      data.value = data;
      error.value = null;
      return data;
    } catch (exception: unknown) {
      error.value = exception as IExceptionResponseDetail;
      data.value = null;
      throw exception;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    isLoading,
    percent,
    data,
    error,
    excute,
  };
}
