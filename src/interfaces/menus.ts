import { RouteLocationNamedRaw } from 'vue-router';

import { IRoomResponse } from './rooms';

export interface IMenuItem {
  key: string;
  value: RouteLocationNamedRaw;
}

export interface ITitleMenuItem extends IMenuItem {
  type: 'title';
  title: string;
}

export interface IIconMenuItem extends IMenuItem {
  type: 'icon';
  icon: string;
  color?: string;
  title: string;
}

export interface IAvatarMenuItem extends IMenuItem {
  type: 'avatar';
  avatar: string;
  color?: string;
  title: string;
}

export interface IRoomMenuItem extends IMenuItem {
  type: 'room';
  room: IRoomResponse;
}

export interface IRootMenuItem extends IMenuItem {
  icon: string;
  onClick?(): void;
  children?: Array<
    ITitleMenuItem | IIconMenuItem | IAvatarMenuItem | IRoomMenuItem
  >;
}
