import { AxiosRequestConfig } from 'axios';

import {
  IAdvancedUserResponse,
  IChangeUserRolesRequest,
  ISearchAdvancedUserRequest,
  ISearchAdvancedUsersRequest,
  ISearchUsersRequest,
  IUserRequest,
  IUserResponse,
} from '@/interfaces';
import { Service } from '@/services/common';

export class UsersService extends Service {
  getAll(config: AxiosRequestConfig, params: ISearchUsersRequest) {
    return this.fetch<{
      count: number;
      totalCount: number;
      records: Array<IUserResponse>;
    }>({
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
    });
  }

  searchAdvanced(
    config: AxiosRequestConfig,
    params: ISearchAdvancedUsersRequest,
  ) {
    return this.fetch<Array<IAdvancedUserResponse>>({
      ...config,
      url: 'users/advanced',
      method: 'GET',
      params,
    });
  }

  searchByUsername(
    config: AxiosRequestConfig,
    params: ISearchAdvancedUserRequest,
  ) {
    return this.fetch<IAdvancedUserResponse>({
      ...config,
      url: `users/page/${params.username}`,
      method: 'GET',
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
