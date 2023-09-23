import { LocalePagesUsers } from '@/locales/type/pages/users';

export const users: LocalePagesUsers = {
  profile: {
    editButton: 'プロフィールを編集',
  },
  relationships: {
    menus: {
      followersYouFollow: '知り合いのフォロワー',
      followers: 'フォロワー',
      following: 'フォロー中',
    },
    noData: {
      followersYouFollow: {
        title: '{username}はあなたが知っているフォロワーがまだいません',
        subtitle:
          'あなたが知っている誰かがフォローすると、ここにリストされます。',
      },
      followers: {
        title: '{username}はまだフォロワーがいません',
        subtitle: '誰かがフォローすると、ここにリストされます。',
      },
      following: {
        title: '{username}はまだ誰もフォローしていません',
        subtitle: '誰かをフォローすると、ここにリストされます。',
      },
    },
    fetchMore: 'さらに読み込む',
  },
  shared: {
    dialogProfileCoverTitle: 'プロフィール画像',
    dialogProfilePhotoTitle: ' プロフィール写真',
  },
};
