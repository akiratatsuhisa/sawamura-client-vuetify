import { LocaleCommonMessages } from '@/locales/type/common/messages';

export const messages: LocaleCommonMessages = {
  success: {
    login: 'ログインに成功しました',
    logout: 'ログアウトに成功しました',
    oauthUnlink: 'プロバイダーのリンクを解除しました',
    updatePassword: 'パスワードが変更されました',
    verifyEmail: '確認メールが送信されました',
    updateEmail: 'メールアドレスが変更されました、確認メールが送信されました',
    changeUserRoles: '{username}さんの権限変更が成功しました',
    createRole: '権限の登録が完了しました',
    updateRole: '権限の編集が完了しました',
    deleteRole: '権限の削除が完了しました',
  },
  info: {
    test: 'テスト',
  },
  warning: {
    defaultData: 'デフォルトデータは変更できません',
    noChange: '並べ替えは変更されません',
    unsupportedFileType: 'サポートされていないファイル形式',
    fileExceededLimit: 'ファイルは${size}制限を超えています',
    requestVeriyEmail: 'アカウントにメールが存在しないか、既に確認されています',
  },
  error: {
    unknown: '不明なエラー',
    notFound: '見つかりません',
    notFoundEntity: '{entity}({id})が見つかりません',
    unauthenticated: '認証されていません',
    unauthorized: '許可されていません',
    accessDenined: 'アクセスが拒否されました',
    badQuery: '不正なリクエストクエリ',
    badDto: '不正なリクエストデータ',
    argument: '不正な引数',
    prisma: 'データベースストレージエラー',
    invalidDateFromTo: '開始日は終了日以下である必要があります',
    changeSort: 'ソートは最大ソートよりも大きいです',
    filesUpload:
      'ファイルのアップロードに失敗しました。アップロードしたファイルを確認するか、もう一度試してください',
    filesDownload:
      'ファイルのダウンロードに失敗しました。ダウンロードしたファイルを確認するか、もう一度試してください',
    filesDelete: 'ファイルの削除に失敗しました。もう一度試してください',
    refreshToken:
      '提供されたリフレッシュトークンは無効または期限切れです。新しいリフレッシュトークンを生成するには、再度ログインしてください',
    verificationToken:
      'この確認トークンは無効または既に使用済みです。アカウントを再度確認する必要がある場合は、新しいトークンをリクエストしてください',
    forgotPassword:
      'ユーザー名が見つかりませんまたはアカウントのメールが確認されていません',
    sameEmailAddressProvided: '同じメールアドレスが提供されました',
    currentPassword:
      '現在のパスワードが一致しません。正しいパスワードを入力してください',
    changeUserRoles: '無効な入力権限',
    notFoundToken: 'リクエスト内でトークンが見つかりません',
    oauthServer: 'プロバイダーをリンクできません',
    providerAlreadyLinked: 'このプロバイダーは既にリンクされています',
    notRoomMember: '{username}さんはルームにいません',
    privateRoomDeclare: '無効なプライベートルームの宣言',
    groupRoomDeclare: '無効なグループルームの宣言',
  },
};
