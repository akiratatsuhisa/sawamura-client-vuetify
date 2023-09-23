import { LocalePagesSettings } from '@/locales/type/pages/settings';

export const settings: LocalePagesSettings = {
  title: '設定',
  account: {
    accountInfomation: {
      title: 'アカウント情報',
      subtitle:
        'アカウントに関する情報を確認したり、データのアーカイブをダウンロードしたり、アカウントの無効化オプションについて学んだりできます。',
    },
    deleteAccount: {
      title: 'アカウントの削除',
      subtitle:
        '澤村アカウントを完全に削除します。削除後はデータの復旧はできません。',
      form: {
        submit: 'アカウントを削除',
      },
      alerts: {
        deleteAlert: {
          message: '本当にアカウントを削除しますか？',
          deny: 'いいえ',
          confirm: 'はい',
        },
        deleteConfirm: {
          message: '同意をクリックすると元に戻すことはできません！',
          cancel: 'キャンセル',
          confirm: '同意',
        },
      },
    },
  },
  display: {
    themeMode: {
      title: 'テーマモード',
      subtitle:
        '表示モードを管理します。これらの設定はこのブラウザ上の全ての澤村アカウントに影響します。',
    },
    personalTheme: {
      title: '個人テーマ',
      subtitle:
        '色や背景を管理します。これらの設定はこのアカウントのみに影響します。',
      form: {
        select: { label: 'ソースカラーの選択' },
        clear: { label: 'クリア' },
      },
    },
  },
  languages: {
    interfaceLanguage: {
      title: 'インターフェース言語',
      subtitle:
        '澤村の見出し、ボタン、その他のテキストに使用する言語を選択してください。',
    },
  },
  email: {
    verifyEmail: {
      title: 'メールの確認',
      subtitle: {
        verified: 'メール: {0}',
        unverified:
          '全ての機能を完全にご利用いただくために、この{0}メールを確認してください',
      },
      form: { submit: '送信' },
    },
    changeEmail: {
      title: 'メールの変更',
      subtitle: '現在のメールは{0}です。何に更新しますか？',
      form: {
        email: {
          label: '現在メール',
          hint: 'メールアドレスを更新した後、確認用のメールが送信されます',
        },
        submit: '保存',
      },
    },
    configureEmail: {
      title: 'メールの設定',
      subtitle: 'アカウントにメールが設定されていません。設定しますか？',
      form: {
        email: { label: 'メール' },
      },
    },
  },
  password: {
    changePassword: {
      title: 'パスワードの変更',
      subtitle:
        'パスワードを変更すると、現在利用中のセッション以外のすべての澤村セッションからログアウトされます。',
      forgotPassword: 'パスワードをお忘れですか？',
      form: {
        currentPassword: { label: '現在パスワード' },
        newPassword: { label: '新パスワード' },
        confirmPassword: {
          label: '確認パスワード',
          hint: 'パスワードを再入力してください',
        },
        submit: '変更',
      },
    },
  },
  oauthProviders: {
    connectedAccounts: {
      title: '連携アカウント',
      subtitle:
        'これは澤村アカウントに接続したソーシャルアカウントで、ログインに使用できます。ここでアクセスの有効化や無効化を行うことができます。',
      form: {
        link: '有効化',
        unlink: '無効化',
      },
      alerts: {
        unlink: {
          message: '{provider}のログイン連携を解除しますか？',
          cancel: 'キャンセル',
          confirm: '同意',
        },
      },
    },
  },
  shared: {
    menus: {
      account: 'アカウント',
      display: '表示',
      languages: '言語',
      email: 'Eメール',
      password: 'パスワード',
      oauthProviders: 'OAuthプロバイダ',
    },
  },
};
