export interface IStorageDropboxRequest {
  data?: null;
}

export interface IStorageDropboxResponse {
  used: number;
  allocated: number;
}

export interface ICountUsersRequest {
  data?: null;
}

export interface ICountUsersResponse {
  count: number;
}

export interface IChartMessgesRequest {
  fromDate: string;
  toDate: string;
}

export interface IChartMessgesResponse {
  records: Array<{
    label: string;
    value: number;
    countMessages: number;
    countFiles: number;
  }>;
}

export interface IChartUserRolesRequest {
  data?: null;
}

export interface IChartUserRolesResponse {
  records: Array<{
    name: string;
    count: number;
  }>;
}
