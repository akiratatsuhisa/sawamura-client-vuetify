import { LocaleCommon } from '@/locales/type/common';

import { messages } from './messages';
import { user } from './user';

export const common: LocaleCommon = {
  app: {
    title: 'Sawamura',
  },
  theme: {
    chooseImage: 'Choose image',
    generateTheme: 'Generate theme',
  },
  themes: {
    light: 'Light',
    dark: 'Dark',
    coffee: 'Coffee',
  },
  providers: { google: 'Google', github: 'Github' },
  languages: { en: 'English', ja: 'Japanese' },
  activeStates: {
    enable: 'Enable',
    disable: 'Disable',
  },
  verifyStates: {
    none: 'None',
    verified: 'Verified',
    unverified: 'Unverified',
  },
  connectStates: {
    connected: 'Connected',
    unconnected: 'Unconnected',
  },
  matches: {
    all: 'Match All',
    any: 'Match Any',
  },
  roomRoles: {
    administrator: 'Administrator',
    moderator: 'Moderator',
    member: 'Member',
  },
  data: {
    noRecord: 'No records match the search conditions',
    create: 'Create',
    insert: 'Insert',
    update: 'Update',
    change: 'Change',
    delete: 'Delete',
    remove: 'Remove',
    view: 'View',
  },
  pagination: {
    limit: '{limit} per pages',
    show: 'Show {limit}',
    showing: 'Showing {from} to {to} of {totalCount} records',
  },
  user,
  messages,
};
