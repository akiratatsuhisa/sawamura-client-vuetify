import { AxiosRequestConfig } from 'axios';

import {
  IAdvancedUserResponse,
  IChangeUserRelationshipRequest,
  IChangeUserRolesRequest,
  IProfileUserResponse,
  ISearchAdvancedUsersRequest,
  ISearchProfileUserRequest,
  ISearchUsersRequest,
  IUserRequest,
  IUserResponse,
} from '@/interfaces';
import { Service } from '@/services/common';

export class UsersService extends Service {
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

  searchProfileByUsername(
    config: AxiosRequestConfig,
    params: ISearchProfileUserRequest,
  ) {
    return this.fetch<IProfileUserResponse>({
      ...config,
      url: `users/profile/${params.username}`,
      method: 'GET',
    });
  }

  changeRelationship(
    config: AxiosRequestConfig,
    data: IChangeUserRelationshipRequest,
  ) {
    return this.fetch<void>({
      ...config,
      url: `users/profile/${data.username}/relationship`,
      method: 'PATCH',
      data,
    });
  }

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
    return this.fetch<void>({
      ...config,
      url: `users/${data.id}/roles`,
      method: 'PATCH',
      data,
    });
  }
}
