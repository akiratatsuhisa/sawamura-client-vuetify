import { AxiosRequestConfig } from 'axios';

import {
  IAdvancedUserResponse,
  IChangeProfileUserRelationshipRequest,
  IProfileUserRelationshipResponse,
  IProfileUserResponse,
  ISearchAdvancedUsersRequest,
  ISearchProfileUserRelationshipsRequest,
  ISearchProfileUserRequest,
} from '@/interfaces';
import { Service } from '@/services/common';

export class ProfileUsersService extends Service {
  searchAdvanced(
    config: AxiosRequestConfig,
    params: ISearchAdvancedUsersRequest,
  ) {
    return this.fetch<Array<IAdvancedUserResponse>>({
      ...config,
      url: 'profileUsers/advanced',
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
      url: `profileUsers/${params.username}`,
      method: 'GET',
    });
  }

  searchRelationships(
    config: AxiosRequestConfig,
    params: ISearchProfileUserRelationshipsRequest,
  ) {
    return this.fetch<Array<IProfileUserRelationshipResponse>>({
      ...config,
      url: `profileUsers/${params.username}/relationships/${params.type}`,
      method: 'GET',
      params,
    });
  }

  changeRelationship(
    config: AxiosRequestConfig,
    data: IChangeProfileUserRelationshipRequest,
  ) {
    return this.fetch<void>({
      ...config,
      url: `profileUsers/${data.username}/relationships`,
      method: 'PATCH',
      data,
    });
  }
}
