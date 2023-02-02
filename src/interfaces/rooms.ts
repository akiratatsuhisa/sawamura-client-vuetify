import { IPaginationCursor } from "./common";

export interface RoomResponse {
  id: string;
  name: string;
  isGroup: boolean;
  roomMembers: Array<RoomMemberResponse>;
  createdAt: string;
}

export interface RoomRequest {
  id: string;
}

export interface CreateRoomRequest {
  name: string;
  isGroup: boolean;
  members: Array<{
    memberId: string;
    role: string;
  }>;
}

export interface UpdateRoomRequest {
  id: string;
  name: string | null;
}

export interface DeleteRoomRequest {
  id: string;
}

export interface SearchRoomsRequest extends IPaginationCursor {}

export interface RoomMemberResponse {
  id: string;
  nickName: string | null;
  role: string;
  member: {
    id: string;
    username: string;
  };
  createdAt: string;
}

export interface CreateRoomMemberRequest {
  memberId: string;
  roomId: string;
  role?: string;
}

export interface UpdateRoomMemberRequest {
  memberId: string;
  roomId: string;
  nickName?: string | null;
  role?: string;
}

export interface DeleteRoomMemberRequest {
  memberId: string;
  roomId: string;
}

export interface RoomMessageResponse {
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

export interface SearchRoomMessagesRequest extends IPaginationCursor {
  roomId: string;
}

export interface CreateRoomMessageRequest {
  roomId: string;
  type?: string;
  content: string;
}

export interface DeleteRoomMessageRequest {
  id: string;
  roomId: string;
}
