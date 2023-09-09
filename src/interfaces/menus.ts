import { RouteLocationNamedRaw } from 'vue-router';

export interface IMenuItem {
  key: string;
  value: RouteLocationNamedRaw;
  translate?: string;
}

export interface INavigationMenuItem extends IMenuItem {
  type: 'navigation';
  icon: string;
  mobile?: boolean;
  children?: Array<ITitleMenuItem | IIconMenuItem | IAvatarMenuItem>;
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
