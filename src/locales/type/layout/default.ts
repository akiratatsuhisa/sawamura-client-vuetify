export type LocaleLayoutDefault = {
  topbar: {
    profile: {
      items: {
        /**
         * @param {string} name
         */
        theme: string;
        settings: string;
        logout: string;
      };
    };
    notification: {
      title: string;
      alerts: {
        delete: {
          message: string;
          cancel: string;
          confirm: string;
        };
      };
    };
  };
  sidebar: {
    menus: {
      home: {
        title: string;
      };
      messages: {
        title: string;
        subs: {
          list: string;
        };
      };
      dashboard: {
        title: string;
        subs: {
          users: string;
          messages: string;
        };
      };
    };
  };
  oauth: {
    messages: {
      unlink: string;
    };
  };
};