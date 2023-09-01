import { AxiosRequestConfig } from 'axios';

import {
  IAdvancedUserResponse,
  ISearchAdvancedUsersRequest,
  ISearchUsersRequest,
  IUserResponse,
} from '@/interfaces';
import { Service } from '@/services/common';

export class UsersService extends Service {
  getAll(config: AxiosRequestConfig, params: ISearchUsersRequest) {
    return this.fetch<Array<IUserResponse>>({
      ...config,
      url: 'users',
      method: 'GET',
      params,
    });
  }

  searchAdvanced(
    config: AxiosRequestConfig,
    params: ISearchAdvancedUsersRequest,
  ) {
    return this.fetch<{
      count: number;
      totalCount: number;
      records: Array<IAdvancedUserResponse>;
    }>({
      ...config,
      url: 'users/advanced',
      method: 'GET',
      params,
    });
  }
}
