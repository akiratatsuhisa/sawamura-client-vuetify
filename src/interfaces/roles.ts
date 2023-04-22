export interface IRoleResponse {
  id: string;
  name: string;
  sort: number;
  default: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IRoleRequest {
  id: string;
}

export interface ICreateRoleRequest {
  name: string;
}

export interface IUpdateRoleRequest {
  id: string;
  name: string;
}

export interface IDeleteRoleRequest {
  id: string;
}

export interface ISortRoleRequest {
  id: string;
  sort: number;
}
