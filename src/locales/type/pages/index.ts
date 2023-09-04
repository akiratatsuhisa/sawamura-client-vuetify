import { LocalePagesAuth } from '@/locales/type/pages/auth';
import { LocalePagesDashboard } from '@/locales/type/pages/dashboard';
import { LocalePagesErrors } from '@/locales/type/pages/errors';
import { LocalePagesHome } from '@/locales/type/pages/home';
import { LocalePagesMessages } from '@/locales/type/pages/messages';
import { LocalePagesOauth } from '@/locales/type/pages/oauth';
import { LocalePagesSettings } from '@/locales/type/pages/settings';
import { LocalePagesUsers } from '@/locales/type/pages/users';

export type LocalePages = {
  errors: LocalePagesErrors;
  home: LocalePagesHome;
  auth: LocalePagesAuth;
  oauth: LocalePagesOauth;
  settings: LocalePagesSettings;
  dashboard: LocalePagesDashboard;
  messages: LocalePagesMessages;
  users: LocalePagesUsers;
};
