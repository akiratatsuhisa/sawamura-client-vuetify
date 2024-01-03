import { AxiosRequestConfig } from 'axios';

import {
  IOauthGenerateTokenResponse,
  IOauthProviderResponse,
  IOauthUnlinkProviderRequest,
} from '@/interfaces';
import { Service } from '@/services/common';

export class OauthService extends Service {
  getProviders(config: AxiosRequestConfig) {
    return this.fetch<Array<IOauthProviderResponse>>({
      ...config,
      url: 'oauth/providers',
      method: 'GET',
    });
  }

  linkProvider(config: AxiosRequestConfig) {
    return this.fetch<IOauthGenerateTokenResponse>({
      ...config,
      url: 'oauth/linkProvider',
      method: 'POST',
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
