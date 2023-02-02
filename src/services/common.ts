import { AxiosInstance, AxiosRequestConfig } from "axios";

export abstract class Service {
  protected fetcher!: AxiosInstance;

  setFetcher(fetcher: AxiosInstance) {
    this.fetcher = fetcher;
    return this;
  }

  protected fetch<Response>(config: AxiosRequestConfig): Promise<Response> {
    return this.fetcher.request<Response>(config).then((response) => {
      return response.data;
    });
  }
}
