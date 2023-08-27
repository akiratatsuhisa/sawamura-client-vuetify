import { LocalePagesErrors } from '@/locales/type/pages/errors';

export const errors: LocalePagesErrors = {
  accessDenied: {
    title: 'アクセスが拒否されました',
    subtitle:
      '申し訳ありませんが、このページへのアクセスは許可されていません。',
  },
  internalServer: {
    title: 'サーバ内部エラー',
    subtitle: '申し訳ありませんが、何か問題が発生しました。',
  },
  notFound: {
    title: 'ページが見つかりません',
    subtitle: '申し訳ありませんが、ご訪問いただいたページは存在しません。',
  },
  shared: {
    returnToHome: 'ホームへ戻る',
  },
};
