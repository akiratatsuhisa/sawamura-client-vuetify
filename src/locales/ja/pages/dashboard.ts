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
    mainchart: { title: '収益' },
  },
  users: {
    tabs: {
      information: '情報',
      roles: '権限',
    },
    title: '検索条件',
    form: {
      username: {
        label: 'ユーザー名',
      },
      name: {
        label: '名前',
      },
      email: {
        label: 'メールアドレス',
      },
      emailStates: {
        label: 'メールステータス',
      },
      sort: {
        label: '並替',
      },
      roleIds: {
        label: '権限',
      },
      roleMode: {
        label: '権限一致モード',
      },
      clear: 'クリア',
      submit: '検索',
    },
    sortList: {
      usernameAsc: 'ユーザー名　A-Z',
      usernameDesc: 'ユーザー名　Z-A',
      createdAtAsc: '作成日時　昇順',
      createdAtDesc: '作成日時　降順',
      updatedAtAsc: '更新日時　昇順',
      updatedAtDesc: '更新日時　降順',
    },
    list: {
      username: 'ユーザー名：{0}',
      timeAgo: '最終更新：{0}',
      redirect: '表示',
    },
    changeRoles: {
      title: 'ユーザー権限を変更',
      subtitle: '権限リスト',
      form: {
        submit: '変更',
      },
      displayMode: 'アドバンストモード',
      tags: {
        default: 'デフォルト',
        notDefault: 'デフォルトなし',
      },
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
    mainchart: {
      title: 'グラフのルーム',
      xAxis: {
        groupRooms: 'グループルーム',
        privateRooms: 'プライベートルーム',
        privateRoomMembers: 'プライベートルームメンバー',
        groupRoomMembers: 'グループルームメンバー',
      },
      yAxis: {
        rooms: 'ルーム',
        roomMembers: 'ルームメンバー',
      },
    },
    subchart: {
      title: 'グラフのメッセージ',
      labels: {
        messages: 'メッセージ',
        images: '画像',
        audios: '音声',
        videos: '動画',
        files: 'ファイル',
      },
    },
  },
  shared: {
    cards: {
      dropbox: 'ドロップボック',
      cache: 'キャッシュ',
      posts: 'ポスト',
      users: 'ユーザー',
      pdf: 'PDF',
      reports: 'レポート',
      bugs: 'バグ',
      revenue: '収益',
    },
  },
};
