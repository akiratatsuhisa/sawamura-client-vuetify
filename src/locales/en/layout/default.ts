import { LocaleLayoutDefault } from '@/locales/type/layout/default';

export const defaultLayout: LocaleLayoutDefault = {
  topbar: {
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
    message: {
      title: 'Chat Rooms',
    },
    profile: {
      items: {
        theme: 'Theme {name}',
        settings: 'Settings',
        logout: 'Logout',
      },
    },
  },
  sidebar: {
    menus: {
      home: {
        title: 'Home',
      },
      messages: {
        title: 'Messages',
        subs: {
          list: 'Room List',
        },
      },
      dashboard: {
        title: 'Dashboard',
        subs: {
          users: 'Users',
          messages: 'Messages',
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
