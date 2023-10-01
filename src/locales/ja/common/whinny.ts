import { LocaleCommonWhinny } from '@/locales/type/common/whinny';

export const whinny: LocaleCommonWhinny = {
  compose: {
    placeholder: 'いまどうしてる？',
    submit: 'ポストする',
  },
  repostTitle: 'リポスト',
  quoteTitle: '引用',
  actions: {
    quotes: {
      subtitle: '{count} 引用',
    },
    comments: {
      subtitle: '{count} コメント',
    },
    reactions: {
      subtitle: '{count} リアクション',
    },
    delete: {
      title: '削除',
      alert: {
        message: 'このウィニーを削除しますか？',
        cancel: 'キャンセル',
        confirm: '同意',
      },
    },
  },
};
