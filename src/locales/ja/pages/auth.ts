import { LocalePagesAuth } from '@/locales/type/pages/auth';

export const auth: LocalePagesAuth = {
  login: {
    title: 'ログイン',
    form: {
      username: { label: 'ユーザ名' },
      password: { label: 'パスワード' },
      submit: '@:pages.auth.login.title',
    },
    forgotPassword: '{username}または{password}をお忘れですか？',
    newTo: {
      text: 'アプリは初めてですか？{0}',
      link: 'アカウントを登録。',
    },
  },
  register: {
    title: 'アカウント登録',
    form: {
      username: { label: 'ユーザ名' },
      displayName: { label: 'ディスプレイ名' },
      email: { label: 'Eメール' },
      password: { label: 'パスワード' },
      confirmPassword: {
        label: '確認パスワード',
        hint: 'パスワードを再入力してください',
      },
      submit: '登録',
    },
    hadAccount: {
      text: 'すでにアカウントをお持ちですか？{0}',
      link: 'ログインへ',
    },
  },
  forgotPassword: {
    title: 'パスワードを忘れた',
    subtitle:
      'アカウントに関連付けられているユーザー名を教えてください。パスワードをリセットするためのリンクが記載されたメールを送信します。',
    form: {
      username: { label: 'ユーザ名' },
      submit: '送信',
    },
  },
  resetPassword: {
    title: 'パスワードのリセット',
    subtitle: 'パスワードをリセットします。',
    form: {
      password: { label: 'パスワード' },
      confirmPassword: {
        label: '確認パスワード',
        hint: 'パスワードを再入力してください',
      },
      submit: 'リセット',
    },
  },
  confirmEmail: {
    title: 'メールの確認',
    subtitle: '「確認」ボタンをクリックすると、メールアドレスが確認されます。',
    form: {
      submit: '確認',
    },
  },
  shared: {
    privacy:
      '続行すると、アカウントを設定し、ユーザー契約とプライバシー ポリシーに同意したことになります。',
    returnToLogin: '{0}へ戻る。',
    usernameHint:
      'ユーザー名はアルファベットで始まり、英数字、アンダースコア、ハイフンのみを含めることができます',
    passwordHint:
      "パスワードは少なくとも1つの大文字、1つの小文字、1つの数字、および1つの特殊文字「{'@'} $ ! % * # ? &」を含める必要があります",
  },
};
