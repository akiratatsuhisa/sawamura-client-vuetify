import { AxiosRequestConfig } from 'axios';

import {
  ICreateWhinnyRequest,
  IDeleteWhinnyRequest,
  IReactWhinnyRequest,
  ISearchWhinniesRequest,
  ISearchWhinnyReactionsRequest,
  IWhinnyReactionResponse,
  IWhinnyRequest,
  IWhinnyResponse,
} from '@/interfaces';
import { Service } from '@/services/common';

export class WhinniesService extends Service {
  getAll(config: AxiosRequestConfig, params: ISearchWhinniesRequest) {
    return this.fetch<Array<IWhinnyResponse>>({
      ...config,
      url: 'whinnies',
      method: 'GET',
      params,
    });
  }

  getByUrlId(config: AxiosRequestConfig, params: IWhinnyRequest) {
    return this.fetch<IWhinnyResponse>({
      ...config,
      url: `whinnies/${params.urlId}`,
      method: 'GET',
    });
  }

  create(config: AxiosRequestConfig, data: ICreateWhinnyRequest) {
    return this.fetch<IWhinnyResponse>({
      ...config,
      url: `whinnies`,
      method: 'POST',
      data,
    });
  }

  delete(config: AxiosRequestConfig, data: IDeleteWhinnyRequest) {
    return this.fetch<void>({
      ...config,
      url: `whinnies/${data.urlId}`,
      method: 'DELETE',
      data,
    });
  }

  getReactions(
    config: AxiosRequestConfig,
    params: ISearchWhinnyReactionsRequest,
  ) {
    return this.fetch<Array<IWhinnyReactionResponse>>({
      ...config,
      url: `whinnies/${params.urlId}/reactions`,
      method: 'GET',
    });
  }

  react(config: AxiosRequestConfig, data: IReactWhinnyRequest) {
    return this.fetch<void>({
      ...config,
      url: `whinnies/${data.urlId}/reactions`,
      method: 'PATCH',
      data,
    });
  }
}
