export type LocalePagesUsers = {
  profile: {
    editButton: string;
  };
  relationships: {
    menus: {
      followersYouFollow: string;
      followers: string;
      following: string;
    };
    noData: {
      followersYouFollow: {
        title: string;
        subtitle: string;
      };
      followers: {
        title: string;
        subtitle: string;
      };
      following: {
        title: string;
        subtitle: string;
      };
    };
    fetchMore: string;
  };
  shared: {
    dialogProfileCoverTitle: string;
    dialogProfilePhotoTitle: string;
  };
};
