import { LocaleLayoutDefault } from '@/locales/type/layout/default';

export const defaultLayout: LocaleLayoutDefault = {
  topbar: {
    notification: {
      title: '通知',
      alerts: {
        delete: {
          message: 'この通知を削除しますか？',
          cancel: 'キャンセル',
          confirm: '同意',
        },
      },
    },
    message: {
      title: 'チャットルーム',
    },
    profile: {
      items: {
        theme: '{name}モード',
        settings: '設定',
        logout: 'ログアウト',
      },
    },
  },
  sidebar: {
    menus: {
      home: {
        title: 'ホーム',
      },
      messages: {
        title: 'メッセージ',
        subs: {
          list: 'ルームリスト',
        },
      },
      dashboard: {
        title: '統計',
        subs: {
          users: 'ユーザー',
          messages: 'メッセージ',
        },
      },
    },
  },
  oauth: {
    messages: {
      unlink: 'プロバイダのリンクを解除しました',
    },
  },
};
