export type LocalePagesSettings = {
  title: string;
  account: {
    accountInfomation: {
      title: string;
      subtitle: string;
    };
    deleteAccount: {
      title: string;
      subtitle: string;
      form: {
        submit: string;
      };
      alerts: {
        deleteAlert: {
          message: string;
          deny: string;
          confirm: string;
        };
        deleteConfirm: {
          message: string;
          cancel: string;
          confirm: string;
        };
      };
    };
  };
  display: {
    themeStyle: {
      title: string;
      subtitle: string;
    };
    themeMode: {
      title: string;
      subtitle: string;
    };
    personalTheme: {
      title: string;
      subtitle: string;
      form: {
        select: { label: string };
        clear: { label: string };
      };
    };
  };
  languages: {
    interfaceLanguage: {
      title: string;
      subtitle: string;
    };
  };
  email: {
    verifyEmail: {
      title: string;
      /**
       * @param {Component} email
       */
      subtitle: {
        verified: string;
        unverified: string;
      };
      form: { submit: string };
    };
    changeEmail: {
      title: string;
      /**
       * @param {Component} email
       */
      subtitle: string;
      form: {
        email: { label: string; hint: string };
        submit: string;
      };
    };
    configureEmail: {
      title: string;
      subtitle: string;
      form: {
        email: { label: string };
      };
    };
  };
  password: {
    changePassword: {
      title: string;
      subtitle: string;
      forgotPassword: string;
      form: {
        currentPassword: { label: string };
        newPassword: { label: string };
        confirmPassword: { label: string; hint: string };
        submit: string;
      };
    };
  };
  oauthProviders: {
    connectedAccounts: {
      title: string;
      subtitle: string;
      form: {
        link: string;
        unlink: string;
      };
      alerts: {
        unlink: {
          /**
           * @param {string} provider
           */
          message: string;
          cancel: string;
          confirm: string;
        };
      };
    };
  };
  shared: {
    menus: {
      account: string;
      display: string;
      languages: string;
      email: string;
      password: string;
      oauthProviders: string;
    };
  };
};
