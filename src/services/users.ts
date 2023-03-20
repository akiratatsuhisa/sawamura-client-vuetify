import { AxiosRequestConfig } from 'axios';

import { ISearchUsersRequest, IUserResponse } from '@/interfaces/users';
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
}
