export type LocaleCommon = {
  app: {
    title: string;
  };
  theme: {
    chooseImage: string;
    generateTheme: string;
  };
  themes: { light: string; dark: string; coffee: string };
  languages: { en: string; ja: string };
  activeStates: {
    enable: string;
    disable: string;
  };
  verifyStates: {
    none: string;
    verified: string;
    unverified: string;
  };
  connectStates: {
    connected: string;
    unconnected: string;
  };
  matches: {
    all: string;
    any: string;
  };
  roomRoles: {
    administrator: string;
    moderator: string;
    member: string;
  };
  data: {
    noRecord: string;
    create: string;
    insert: string;
    update: string;
    change: string;
    delete: string;
    remove: string;
    view: string;
  };
  pagination: {
    /**
     * @param {number} limit
     */
    limit: string;
    /**
     * @param {number} limit
     */
    show: string;
    /**
     * @param {number} from
     * @param {number} to
     * @param {number} totalCount
     */
    showing: string;
  };
};
