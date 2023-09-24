import { LocalePages } from '@/locales/type/pages';

import { auth } from './auth';
import { dashboard } from './dashboard';
import { errors } from './errors';
import { explore } from './explore';
import { home } from './home';
import { messages } from './messages';
import { oauth } from './oauth';
import { settings } from './settings';
import { users } from './users';

export const pages: LocalePages = {
  errors,
  auth,
  oauth,
  settings,
  dashboard,
  home,
  explore,
  messages,
  users,
};
