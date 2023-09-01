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
    subchart: 'Chart User Roles',
    roles: {
      subtitle: 'Totals Roles: {0}',
      actions: {
        default: 'Default value',
        create: 'Create',
        update: 'Update',
        delete: 'Delete',
      },
      messages: {
        create: 'Create Role Completed',
        update: 'Update Role Completed',
        delete: 'Delete Role Completed',
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
    subchart: 'Chart Messages',
  },
};