import { Component } from 'vue';

import { IPaginationCursor } from '@/interfaces';

export interface ISearchAdvancedUsersRequest {
  search?: string;
}

export interface IAdvancedUserResponse {
  id: string;
  username: string;
  displayName: string | null;
  firstName: string | null;
  lastName: string | null;
  photoUrl: string | null;
  coverUrl: string | null;
  themeSource: number | null;
  themeStyle: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ISearchProfileUserRequest {
  username: string;
}

export interface IProfileUserResponse {
  id: string;
  username: string;
  displayName: string | null;
  firstName: string | null;
  lastName: string | null;
  birthDate: string | null;
  location: string | null;
  salary: string | null;
  biography: string | null;
  websiteLink: string | null;
  photoUrl: string | null;
  coverUrl: string | null;
  themeSource: string | null;
  themeStyle: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  _count: {
    followers: number;
    followees: number;
  };
}

export type ProfileUserRelationshipType =
  | 'followers-you-follow'
  | 'followers'
  | 'following';

export type ProfileUserRelationshipTab = {
  name: string;
  icon: string;
  component: Component;
};

export type ProfileUserRelationshipTabs = Record<
  ProfileUserRelationshipType,
  ProfileUserRelationshipTab
>;

export interface ISearchProfileUserRelationshipsRequest
  extends IPaginationCursor {
  username: string;
  type: ProfileUserRelationshipType;
}

export interface IProfileUserRelationshipResponse {
  id: string;
  user: {
    id: string;
    username: string;
    displayName: string;
    biography: string | null;
    photoUrl: string | null;
  };
  state: string;
}

export enum ProfileUserRelationshipState {
  Follow = 'follow',
  Unfollow = 'unfollow',
}

export interface IChangeProfileUserRelationshipRequest {
  username: string;
  relationshipState: ProfileUserRelationshipState;
}

export interface IChangeProfileUserRelationshipResponse {}
