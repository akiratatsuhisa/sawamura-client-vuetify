import { IPaginationExcludeIds } from '@/interfaces';

export enum NotificationEntityName {
  User = 'User',
  Room = 'Room',
  RoomMessage = 'RoomMessage',
  RoomMember = 'RoomMember',
  None = 'None',
}

export enum NotificationStatus {
  Queued = 'Queued',
  Sent = 'Sent',
  Delivered = 'Delivered',
  Viewed = 'Viewed',
  Read = 'Read',
  Archived = 'Archived',
}

export interface INotificationResponse {
  id: string;
  entity: NotificationEntityName;
  referenceId: string | null;
  sourceUser: {
    id: string;
    username: string;
    photoUrl: string | null;
  };
  targetUser: {
    id: string;
    username: string;
    photoUrl: string | null;
  };

  code: string;
  params: unknown;
  status: NotificationStatus;
  viewedAt: string | null;
  readAt: string | null;
  createdAt: string;
  updatedAt: string;
  reference: any;
}

export interface ISearchNotificationRequest extends IPaginationExcludeIds {}

export interface IUpdateNotificationRequest {
  id: string;
  status:
    | NotificationStatus.Delivered
    | NotificationStatus.Viewed
    | NotificationStatus.Read
    | NotificationStatus.Archived;
}

export interface IDeleteNotificationRequest {
  id: string;
}
