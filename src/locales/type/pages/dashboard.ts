export type LocalePagesDashboard = {
  index: {
    breadcrumbs: {
      dashboard: string;
      users: string;
      roles: string;
      messages: string;
    };
    import: string;
    mainchart: { title: string };
  };
  users: {
    tabs: {
      information: string;
      roles: string;
    };
    title: string;
    form: {
      username: { label: string };
      name: { label: string };
      email: { label: string };
      emailStates: { label: string };
      sort: { label: string };
      roleIds: { label: string };
      roleMode: { label: string };
      clear: string;
      submit: string;
    };
    sortList: {
      usernameAsc: string;
      usernameDesc: string;
      createdAtAsc: string;
      createdAtDesc: string;
      updatedAtAsc: string;
      updatedAtDesc: string;
    };
    list: {
      /**
       * @param {Component} 0
       */
      username: string;
      /**
       * @param {Component} 0
       */
      timeAgo: string;
      redirect: string;
    };
    changeRoles: {
      title: string;
      subtitle: string;
      /**
       * @param {string} username
       */
      form: {
        submit: string;
      };
      displayMode: string;
      tags: {
        default: string;
        notDefault: string;
      };
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
    mainchart: {
      title: string;
      xAxis: {
        groupRooms: string;
        privateRooms: string;
        groupRoomMembers: string;
        privateRoomMembers: string;
      };
      yAxis: {
        rooms: string;
        roomMembers: string;
      };
    };
    subchart: {
      title: string;
      labels: {
        messages: string;
        images: string;
        audios: string;
        videos: string;
        files: string;
      };
    };
  };
  shared: {
    cards: {
      dropbox: string;
      cache: string;
      posts: string;
      users: string;
      pdf: string;
      reports: string;
      bugs: string;
      revenue: string;
    };
  };
};
