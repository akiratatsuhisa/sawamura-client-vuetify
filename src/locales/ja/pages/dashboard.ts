import { LocalePagesDashboard } from '@/locales/type/pages/dashboard';

export const dashboard: LocalePagesDashboard = {
  index: {
    breadcrumbs: {
      dashboard: 'ダッシュボード',
      users: 'ユーザー',
      roles: '権限',
      messages: 'メッセージ',
    },
    import: '入力CSV',
  },
  users: {
    tabs: {
      information: '情報',
      roles: '権限',
    },
    subchart: 'グラフのユーザー権限',
    roles: {
      subtitle: '合計権限：{0}',
      actions: {
        default: 'デフォルト値',
        create: '登録',
        update: '編集',
        delete: '削除',
      },
      create: {
        title: '権限@:pages.dashboard.users.roles.actions.create',
        form: {
          name: { label: '権限名' },
          submit: '@:pages.dashboard.users.roles.actions.create',
        },
      },
      messages: {
        create: '権限の登録が完了しました',
        update: '権限の編集が完了しました',
        delete: '権限の削除が完了しました',
      },
      update: {
        title: '権限@:pages.dashboard.users.roles.actions.update',
        form: {
          id: { label: 'Id' },
          name: { label: '権限名' },
          submit: '@:pages.dashboard.users.roles.actions.update',
        },
      },
      delete: {
        title: '権限@:pages.dashboard.users.roles.actions.delete',
        message: '{name}を削除しますか？',
        form: {
          id: { label: 'Id' },
          submit: '@:pages.dashboard.users.roles.actions.delete',
        },
      },
    },
  },
  messages: {
    subchart: 'グラフのメッセージ',
  },
};
