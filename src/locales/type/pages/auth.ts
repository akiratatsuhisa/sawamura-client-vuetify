export type LocalePagesAuth = {
  login: {
    title: string;
    form: {
      username: { label: string };
      password: { label: string };
      submit: string;
    };
    /**
     * @param {Component} username
     * @param {Component} password
     */
    forgotPassword: string;
    newTo: {
      /**
       * @param {Component} 0
       */
      text: string;
      link: string;
    };
  };
  register: {
    title: string;
    form: {
      username: { label: string };
      displayName: { label: string };
      email: { label: string };
      password: { label: string };
      confirmPassword: { label: string; hint: string };
      submit: string;
    };
    hadAccount: {
      /**
       * @param {Component} 0
       */
      text: string;
      link: string;
    };
  };
  forgotPassword: {
    title: string;
    subtitle: string;
    form: {
      username: { label: string };
      submit: string;
    };
  };
  resetPassword: {
    title: string;
    subtitle: string;
    form: {
      password: { label: string };
      confirmPassword: { label: string; hint: string };
      submit: string;
    };
  };
  confirmEmail: {
    title: string;
    subtitle: string;
    form: {
      submit: string;
    };
  };
  shared: {
    privacy: string;
    /**
     * @param {Component} 0
     */
    returnToLogin: string;
  };
};
