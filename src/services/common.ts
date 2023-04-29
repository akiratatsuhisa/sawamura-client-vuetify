import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

export abstract class Service {
  protected fetcher!: AxiosInstance;

  setFetcher(fetcher: AxiosInstance) {
    this.fetcher = fetcher;
    return this;
  }

  protected fetch<Response>(
    config: AxiosRequestConfig,
  ): Promise<AxiosResponse<Response>> {
    return this.fetcher.request<Response>(config);
  }
}
