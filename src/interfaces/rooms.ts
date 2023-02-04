import { IPaginationCursor, IPaginationExcludeIds } from "./common";

export interface IRoomResponse {
  id: string;
  name: string;
  isGroup: boolean;
  roomMembers: Array<IRoomMemberResponse>;
  createdAt: string;
}

export interface IRoomRequest {
  id: string;
}

export interface ICreateRoomRequest {
  name: string;
  isGroup: boolean;
  members: Array<{
    memberId: string;
    role: string;
  }>;
}

export interface IUpdateRoomRequest {
  id: string;
  name: string | null;
}

export interface IDeleteRoomRequest {
  id: string;
}

export interface ISearchRoomsRequest extends IPaginationExcludeIds {}

export interface IRoomMemberResponse {
  id: string;
  nickName: string | null;
  role: string;
  member: {
    id: string;
    username: string;
  };
  createdAt: string;
}

export interface ICreateRoomMemberRequest {
  memberId: string;
  roomId: string;
  role?: string;
}

export interface IUpdateRoomMemberRequest {
  memberId: string;
  roomId: string;
  nickName?: string | null;
  role?: string;
}

export interface IDeleteRoomMemberRequest {
  memberId: string;
  roomId: string;
}

export interface IRoomMessageResponse {
  id: string;
  createdAt: string;
  room: {
    id: string;
  };
  type: string;
  content: any;
  user: {
    id: string;
    username: string;
  };
}

export interface ISearchRoomMessagesRequest extends IPaginationCursor {
  roomId: string;
}

export interface ICreateRoomMessageRequest {
  roomId: string;
  type?: string;
  content: string;
}

export interface IDeleteRoomMessageRequest {
  id: string;
  roomId: string;
}
