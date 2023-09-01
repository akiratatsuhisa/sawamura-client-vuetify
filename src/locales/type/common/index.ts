export type LocaleCommon = {
  app: {
    title: string;
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
  roomRoles: {
    administrator: string;
    moderator: string;
    member: string;
  };
};
