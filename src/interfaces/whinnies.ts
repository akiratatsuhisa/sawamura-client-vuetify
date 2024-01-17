import { IPaginationCursor } from '@/interfaces/common';

export interface IWhinnyResponse {
  id: string;
  urlId: string;
  type: string;
  content: string | null;
  publishDate: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    username: string;
    displayName: string;
    photoUrl: string | null;
  };
  source: {
    id: string;
    urlId: string;
    type: string;
    content: string | null;
    publishDate: string;
    createdAt: string;
    updatedAt: string;
    user: {
      id: string;
      username: string;
      displayName: string;
      photoUrl: string | null;
    } | null;
  } | null;
  countReactions: number;
  countComments: number;
  countQuotes: number;
  hasReaction: boolean;
  repostUrlId: string | null;
}

export interface ISearchWhinniesRequest extends IPaginationCursor {
  sourceId?: string;
  username?: string;
}

export interface IWhinnyRequest {
  urlId: string;
}

export interface ICreateWhinnyRequest {
  type: string;
  sourceId?: string | null;
  content?: string | null;
  publishDate?: string | null;
}

export interface IDeleteWhinnyRequest {
  urlId: string;
}

export interface ISearchWhinnyReactionsRequest extends IPaginationCursor {
  urlId: string;
}

export interface IWhinnyReactionResponse {
  id: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    username: string;
    displayName: string;
    photoUrl: string | null;
  };
  kind: string;
  icon: string | null;
}

export interface IReactWhinnyRequest {
  urlId: string;
  kind: string;
}

export interface IComposeWhinnyProps {
  type: 'Owner' | 'Quote' | 'Comment';
  username?: string;
  whinny?: IWhinnyResponse;
}
