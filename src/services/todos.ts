import { AxiosRequestConfig } from "axios";

import { SearchTodosRequest, TodoResponse } from "@/interfaces/todos";
import { Service } from "@/services/common";

export class TodosService extends Service {
  getAll(config: AxiosRequestConfig, params: SearchTodosRequest) {
    return this.fetch<Array<TodoResponse>>({
      ...config,
      url: "todos",
      method: "GET",
      params,
    });
  }

  file(config: AxiosRequestConfig, data: any) {
    return this.fetch<Array<string>>({
      ...config,
      url: "todos/file",
      method: "POST",
      data,
    });
  }
}
