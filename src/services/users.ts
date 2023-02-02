import { AxiosRequestConfig } from "axios";

import { SearchUsersRequest, UserResponse } from "@/interfaces/users";
import { Service } from "@/services/common";

export class UsersService extends Service {
  getAll(config: AxiosRequestConfig, params: SearchUsersRequest) {
    return this.fetch<Array<UserResponse>>({
      ...config,
      url: "users",
      method: "GET",
      params,
    });
  }
}
