import { LocalePagesDashboard } from '@/locales/type/pages/dashboard';

export const dashboard: LocalePagesDashboard = {
  index: {
    breadcrumbs: {
      dashboard: 'Dashboard',
      users: 'Users',
      roles: 'Roles',
      messages: 'Messages',
    },
    import: 'Import CSV',
  },
  users: {
    tabs: {
      information: 'Information',
      roles: 'Roles',
    },
    title: 'Search Conditions',
    form: {
      username: {
        label: 'Username',
      },
      name: {
        label: 'Name',
      },
      email: {
        label: 'Email',
      },
      emailStates: {
        label: 'Email States',
      },
      sort: {
        label: 'Sort',
      },
      roleIds: {
        label: 'Roles',
      },
      roleMode: {
        label: 'Role Match Mode',
      },
      clear: 'Clear',
      submit: 'Search',
    },
    sortList: {
      usernameAsc: 'Username A-Z',
      usernameDesc: 'Username Z-A',
      createdAtAsc: 'Created at Asc',
      createdAtDesc: 'Created at Desc',
      updatedAtAsc: 'Updated at Desc',
      updatedAtDesc: 'Updated at Desc',
    },
    list: {
      username: 'Username: {0}',
      timeAgo: 'Last update: {0}',
      redirect: 'View',
    },
    changeRoles: {
      title: 'Change User Roles',
      subtitle: 'Role List',
      form: {
        submit: 'Change',
      },
      displayMode: 'Advanced Mode',
      tags: {
        default: 'Default',
        notDefault: 'Not Default',
      },
    },
    subchart: 'Chart User Roles',
    roles: {
      subtitle: 'Totals Roles: {0}',
      actions: {
        default: 'Default value',
        create: 'Create',
        update: 'Update',
        delete: 'Delete',
      },
      create: {
        title: 'Role @:pages.dashboard.users.roles.actions.create',
        form: {
          name: { label: 'Role name' },
          submit: '@:pages.dashboard.users.roles.actions.create',
        },
      },
      update: {
        title: 'Role @:pages.dashboard.users.roles.actions.update',
        form: {
          id: { label: 'Id' },
          name: { label: 'Role name' },
          submit: '@:pages.dashboard.users.roles.actions.update',
        },
      },
      delete: {
        title: 'Role @:pages.dashboard.users.roles.actions.delete',
        message: 'Do you want to delete {name}?',
        form: {
          id: { label: 'Id' },
          submit: '@:pages.dashboard.users.roles.actions.delete',
        },
      },
    },
  },
  messages: {
    mainchart: {
      title: 'Chart Rooms',
      xAxis: {
        groupRooms: 'Group Rooms',
        privateRooms: 'Private Rooms',
        groupRoomMembers: 'Group Room Members',
        privateRoomMembers: 'Private Room Members',
      },
      yAxis: {
        rooms: 'Rooms',
        roomMembers: 'Room Members',
      },
    },
    subchart: {
      title: 'Chart Messages',
      labels: {
        messages: 'Messages',
        images: 'Images',
        audios: 'Audios',
        videos: 'Videos',
        files: 'Files',
      },
    },
  },
  shared: {
    cards: {
      dropbox: 'Dropbox Storage',
      cache: 'Cache',
      posts: 'Posts',
      users: 'Users',
      pdf: 'PDF',
      reports: 'Report',
      bugs: 'Bugs',
      revenue: 'Revenue',
    },
  },
};
