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
    countImages: number;
    countAudios: number;
    countVideos: number;
    countFiles: number;
  }>;
}

export interface IChartMessgesRoomsRequest {
  fromDate: string;
  toDate: string;
}

export interface IChartMessgesRoomsResponse {
  records: Array<{
    label: string;
    value: number;
    countGroupRooms: number;
    countPrivateRooms: number;
    countGroupRoomMembers: number;
    countPrivateRoomMembers: number;
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
