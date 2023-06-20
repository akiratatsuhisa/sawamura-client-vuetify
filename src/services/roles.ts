import { AxiosRequestConfig } from 'axios';

import {
  ICreateRoleRequest,
  IDeleteRoleRequest,
  IRoleRequest,
  IRoleResponse,
  ISortRoleRequest,
  IUpdateRoleRequest,
} from '@/interfaces';
import { Service } from '@/services/common';

export class RolesService extends Service {
  getAll(config: AxiosRequestConfig, params: {}) {
    return this.fetch<Array<IRoleResponse>>({
      ...config,
      url: 'roles',
      method: 'GET',
      params,
    });
  }

  sort(config: AxiosRequestConfig, data: ISortRoleRequest) {
    return this.fetch<IRoleResponse>({
      ...config,
      url: `roles/${data.id}/sort`,
      method: 'PATCH',
      data,
    });
  }

  getById(config: AxiosRequestConfig, params: IRoleRequest) {
    return this.fetch<IRoleResponse>({
      ...config,
      url: `roles/${params.id}`,
      method: 'GET',
      params,
    });
  }

  create(config: AxiosRequestConfig, data: ICreateRoleRequest) {
    return this.fetch<IRoleResponse>({
      ...config,
      url: 'roles',
      method: 'POST',
      data,
    });
  }

  update(config: AxiosRequestConfig, data: IUpdateRoleRequest) {
    return this.fetch<IRoleResponse>({
      ...config,
      url: `roles/${data.id}`,
      method: 'PUT',
      data,
    });
  }

  delete(config: AxiosRequestConfig, data: IDeleteRoleRequest) {
    return this.fetch<IRoleResponse>({
      ...config,
      url: `roles/${data.id}`,
      method: 'DELETE',
      data,
    });
  }
}
