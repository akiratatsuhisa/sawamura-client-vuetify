import { LocaleCommonWhinny } from '@/locales/type/common/whinny';

export const whinny: LocaleCommonWhinny = {
  compose: {
    placeholder: 'What is happening?!',
    submit: 'Post',
  },
  repostTitle: 'Repost',
  quoteTitle: 'Quote',
  actions: {
    quotes: {
      subtitle: '{count} quote | {count} quote | {count} quotes',
    },
    comments: {
      subtitle: '{count} comment | {count} comment | {count} comments',
    },
    reactions: {
      subtitle: '{count} reaction | {count} reactions | {count} reactions',
    },
    delete: {
      title: 'Delete',
      alert: {
        cancel: 'Cancel',
        confirm: 'OK',
        message: 'Delete this whinny',
      },
    },
  },
};
