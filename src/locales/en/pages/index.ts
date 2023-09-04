import { LocalePages } from '@/locales/type/pages';

import { auth } from './auth';
import { dashboard } from './dashboard';
import { errors } from './errors';
import { home } from './home';
import { messages } from './messages';
import { oauth } from './oauth';
import { settings } from './settings';
import { users } from './users';

export const pages: LocalePages = {
  errors,
  home,
  auth,
  oauth,
  settings,
  dashboard,
  messages,
  users,
};
