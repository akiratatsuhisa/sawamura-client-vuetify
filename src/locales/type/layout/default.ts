export type LocaleLayoutDefault = {
  topbar: {
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
    message: {
      title: string;
    };
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
