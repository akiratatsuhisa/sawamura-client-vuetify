import { LocaleLayoutDefault } from '@/locales/type/layout/default';

export const defaultLayout: LocaleLayoutDefault = {
  topbar: {
    profile: {
      items: {
        theme: 'Theme {name}',
        settings: 'Settings',
        logout: 'Logout',
      },
    },
    notification: {
      title: 'Notification',
      alerts: {
        delete: {
          message: 'Do you want to delete this notification?',
          cancel: 'Cancel',
          confirm: 'Agree',
        },
      },
    },
  },
  oauth: {
    messages: {
      unlink: 'Unlink provider successfully',
    },
  },
};
