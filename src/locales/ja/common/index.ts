import { LocaleCommon } from '@/locales/type/common';

import { messages } from './messages';
import { user } from './user';
import { whinny } from './whinny';

export const common: LocaleCommon = {
  app: {
    title: '澤村',
  },
  theme: {
    chooseImage: '画像を選択',
    generateTheme: 'テーマを生成',
  },
  styles: {
    default: 'デフォルト',
    mixed: 'ミックス',
    override: 'オーバーライド',
    none: 'なし',
  },
  themes: {
    light: 'ライト',
    dark: 'ダーク',
    coffee: 'コーヒー',
  },
  providers: { google: 'グーグル', github: 'ギットハブ' },
  languages: { en: '英語', ja: '日本語' },
  activeStates: {
    enable: '有効',
    disable: '無効',
  },
  verifyStates: {
    none: '無し',
    verified: '認証済み',
    unverified: '未認証',
  },
  connectStates: {
    connected: '接続済み',
    unconnected: '未接続',
  },
  matches: {
    all: 'すべて一致',
    any: 'いずれか一致',
  },
  roomRoles: {
    administrator: '管理者',
    moderator: 'モデレーター',
    member: 'メンバー',
  },
  data: {
    noRecord: '検索条件に一致するレコードはありません',
    create: '登録',
    insert: '追加',
    update: '編集',
    change: '変更',
    delete: '削除',
    remove: '解除',
    view: '表示',
  },
  pagination: {
    limit: '{limit}件ずつ',
    show: '{limit}件表示',
    showing: 'レコード{from}から{to}までを表示中（全{totalCount}件）',
  },
  share: {
    repost: 'リポスト',
    quote: '引用',
    copyLink: 'リンクをコピー',
    copyLinkSuccessfully: 'リンクのコピーに成功しました',
    copyLinkFailed: 'リンクのコピーに失敗しました',
    shareVia: 'その他の方法でポストを共有する...',
    unsupported: 'ブラウザは共有方法をサポートしていません',
  },
  recommendFollows: {
    title: 'おすすめのフォロー',
  },
  trends: {
    title: 'トレンド',
  },
  user,
  messages,
  whinny,
};
