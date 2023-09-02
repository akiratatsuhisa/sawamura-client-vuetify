import { AxiosRequestConfig } from 'axios';

import {
  IAdvancedUserResponse,
  IChangeUserRolesRequest,
  ISearchAdvancedUsersRequest,
  ISearchUsersRequest,
  IUserRequest,
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

  getById(config: AxiosRequestConfig, params: IUserRequest) {
    return this.fetch<IUserResponse>({
      ...config,
      url: `users/${params.id}`,
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

  changeRoles(config: AxiosRequestConfig, data: IChangeUserRolesRequest) {
    return this.fetch<void>({
      ...config,
      url: `users/${data.id}/roles`,
      method: 'PATCH',
      data,
    });
  }
}
