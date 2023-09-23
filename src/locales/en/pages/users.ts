import { LocalePagesUsers } from '@/locales/type/pages/users';

export const users: LocalePagesUsers = {
  profile: {
    editButton: 'Edit Profile',
  },
  relationships: {
    menus: {
      followersYouFollow: 'Followers You Follow',
      followers: 'Followers',
      following: 'Following',
    },

    fetchMore: 'Fetch More',
    noData: {
      followersYouFollow: {
        title: '{username} doesn’t have any followers you know yet',
        subtitle: 'When someone you know follows them, they’ll be listed here.',
      },
      followers: {
        title: '{username} doesn’t have any followers yet',
        subtitle: 'When someone follows them, they’ll be listed here.',
      },
      following: {
        title: '{username} hasn’t followed anyone yet',
        subtitle: 'When they follow someone, they’ll be listed here.',
      },
    },
  },
  shared: {
    dialogProfileCoverTitle: 'Profile Cover',
    dialogProfilePhotoTitle: 'Profile Photo',
  },
};
