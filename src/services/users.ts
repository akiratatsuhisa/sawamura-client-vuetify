import { AxiosRequestConfig } from 'axios';

import {
  IChangeUserRolesRequest,
  IChangeUserRolesResponse,
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

  changeRoles(config: AxiosRequestConfig, data: IChangeUserRolesRequest) {
    return this.fetch<IChangeUserRolesResponse>({
      ...config,
      url: `users/${data.id}/roles`,
      method: 'PATCH',
      data,
    });
  }
}
