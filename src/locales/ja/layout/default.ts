import { LocaleLayoutDefault } from '@/locales/type/layout/default';

export const defaultLayout: LocaleLayoutDefault = {
  topbar: {
    profile: {
      items: {
        theme: '{name}モード',
        settings: '設定',
        logout: 'ログアウト',
      },
    },
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
  },
  oauth: {
    messages: {
      unlink: 'プロバイダのリンクを解除しました',
    },
  },
};
