import { AxiosRequestConfig } from 'axios';

import {
  IOauthFindProvidersRequest,
  IOauthGenerateTokenResponse,
  IOauthLinkProviderRequest,
  IOauthProviderResponse,
  IOauthUnlinkProviderRequest,
} from '@/interfaces';
import { Service } from '@/services/common';

export class OauthService extends Service {
  getProviders(config: AxiosRequestConfig, params: IOauthFindProvidersRequest) {
    return this.fetch<Array<IOauthProviderResponse>>({
      ...config,
      url: 'oauth/providers',
      method: 'GET',
      params,
    });
  }

  linkProvider(config: AxiosRequestConfig, data: IOauthLinkProviderRequest) {
    return this.fetch<IOauthGenerateTokenResponse>({
      ...config,
      url: 'oauth/linkProvider',
      method: 'POST',
      data,
    });
  }

  unlinkProvider(
    config: AxiosRequestConfig,
    data: IOauthUnlinkProviderRequest,
  ) {
    return this.fetch<void>({
      ...config,
      url: 'oauth/unlinkProvider',
      method: 'DELETE',
      data,
    });
  }
}
