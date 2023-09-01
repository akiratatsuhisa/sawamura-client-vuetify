import { RouteLocationNamedRaw } from 'vue-router';

import { IRoomResponse } from '@/interfaces';

export interface IMenuItem {
  key: string;
  value: RouteLocationNamedRaw;
  translate?: string;
}

export interface IRailMenuItem extends IMenuItem {
  type: 'rail';
  icon: string;
  children?: Array<
    ITitleMenuItem | IIconMenuItem | IAvatarMenuItem | IRoomMenuItem
  >;
  onClick?(): void;
}

export interface ITitleMenuItem extends IMenuItem {
  type: 'title';
}

export interface IIconMenuItem extends IMenuItem {
  type: 'icon';
  icon: string;
  color?: string;
}

export interface IAvatarMenuItem extends IMenuItem {
  type: 'avatar';
  avatar: string;
  color?: string;
}

export interface IRoomMenuItem extends IMenuItem {
  type: 'room';
  room: IRoomResponse;
}
