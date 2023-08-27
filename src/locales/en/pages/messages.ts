import { LocalePagesMessages } from '@/locales/type/pages/messages';

export const messages: LocalePagesMessages = {
  list: {
    title: 'Messages',
    subtitle: 'Rooms',
    createGroup: 'Create Group',
    fetchMore: 'Fetch More',
    dialogs: {
      createGroup: {
        title: 'Create Room Group',
        form: {
          name: {
            label: 'Room name',
          },
          members: {
            label: 'Member(s)',
          },
          submit: 'Create',
        },
      },
    },
  },
  room: {
    lastActivated: 'Last Activated: {lastActivated}',
    messages: {
      menus: {
        delete: 'Delete',
      },
    },
    input: {
      placeHolder: 'Aa',
    },
    menus: {
      basicsInformation: {
        index: 'Basics Information',
        editName: 'Edit Name',
        changePhoto: 'Change Photo',
        changeCover: 'Change Cover',
        chooseTheme: 'Choose Theme',
        deleteChat: 'Delete Chat',
        reactionIcon: 'Reaction Icon',
      },
      support: { index: 'Support', outGroup: 'Out Group' },
      members: {
        index: 'Members',
        addMember: 'Add Member',
        changeNickName: 'Change NickName',
        changeRole: 'Change Role',
        removeMember: 'Remove Member',
      },
    },
    dialogs: {
      editName: {
        title: 'Room',
        form: {
          id: { label: 'id' },
          name: { label: 'Room name' },
          submit: 'Edit',
        },
      },
      changePhoto: {
        title: 'Change Photo',
        form: {
          submit: 'Change',
        },
      },
      changeCover: {
        title: 'Change Cover',
        delete: 'Delete',
        form: {
          submit: 'Change',
        },
        alerts: {
          delete: {
            message: 'Do you want to delete room cover?',
            cancel: 'Cancel',
            confirm: 'Agree',
          },
        },
      },
      chooseTheme: {
        title: 'Choose Theme',
        select: 'Select Source Color',
        clear: 'Clear',
        form: {
          submit: 'Change',
        },
      },
      deleteChat: {
        title: 'Room',
        message: 'Do you want to delete this room?',
        form: {
          id: { label: 'id' },
          submit: 'Delete',
        },
      },
      reactionIcon: {
        title: 'Reaction Icon',
        clear: 'Clear',
        form: {
          submit: 'Choose',
        },
      },
      addMember: {
        title: 'Room Member',
        form: {
          roomId: {
            label: 'Room id',
          },
          member: {
            label: 'Member',
          },
          role: {
            label: 'Role',
          },
          submit: 'Add',
        },
      },
      changeNickName: {
        title: 'Room Member',
        form: {
          roomId: {
            label: 'Room id',
          },
          memberId: {
            label: 'Member id',
          },
          nickName: {
            label: 'Nick name',
            hint: 'Click clear icon to clear nickname',
          },
          submit: 'Edit',
        },
      },
      changeRole: {
        title: 'Room Member',
        form: {
          roomId: {
            label: 'Room id',
          },
          memberId: {
            label: 'Member id',
          },
          role: {
            label: 'Change Role',
          },
          submit: 'Change',
        },
      },
      removeMember: {
        title: 'Room Member',
        message: 'Do you want to remove member {member}',
        selfMessage: 'Do you want to out this group?',
        form: {
          roomId: {
            label: 'Room id',
          },
          memberId: {
            label: 'Member id',
          },
          submit: 'Remove',
        },
      },
    },
  },
  shared: {
    chooseImage: 'Choose image',
    generateTheme: 'Generate theme from uploaded image',
    roomTypes: {
      group: 'Group',
      private: 'Private',
    },
    roomRoles: {
      admin: 'Administrator',
      moderator: 'Moderator',
      member: 'Member',
    },
  },
};
