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
  oauth: {
    messages: {
      unlink: string;
    };
  };
};
