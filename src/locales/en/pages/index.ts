import { LocalePages } from '@/locales/type/pages';

import { auth } from './auth';
import { dashboard } from './dashboard';
import { errors } from './errors';
import { home } from './home';
import { messages } from './messages';
import { oauth } from './oauth';
import { settings } from './settings';

export const pages: LocalePages = {
  home,
  auth,
  oauth,
  settings,
  dashboard,
  messages,
  errors,
};
