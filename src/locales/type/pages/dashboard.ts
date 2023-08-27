export type LocalePagesDashboard = {
  index: {
    breadcrumbs: {
      dashboard: string;
      users: string;
      roles: string;
      messages: string;
    };
    import: string;
  };
  users: {
    tabs: {
      information: string;
      roles: string;
    };
    subchart: string;
    roles: {
      /**
       * @param {Component} 0
       */
      subtitle: string;
      actions: {
        default: string;
        create: string;
        update: string;
        delete: string;
      };
      messages: {
        create: string;
        update: string;
        delete: string;
      };
      create: {
        title: string;
        form: {
          name: { label: string };
          submit: string;
        };
      };
      update: {
        title: string;
        form: {
          id: { label: string };
          name: { label: string };
          submit: string;
        };
      };
      delete: {
        title: string;
        /**
         * @param {string} name
         */
        message: string;
        form: {
          id: { label: string };
          submit: string;
        };
      };
    };
  };
  messages: {
    subchart: string;
  };
};
