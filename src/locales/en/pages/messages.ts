import { LocalePagesMessages } from '@/locales/type/pages/messages';

export const messages: LocalePagesMessages = {
  list: {
    title: 'Messages',
    subtitle: 'Rooms',
    createGroup: 'Create Group',
    enterChat: 'Enter Chat',
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
      placeholder: 'Aa',
      actions: {
        sendFiles: 'Send File(s)',
        captureImage: 'Capture Image',
        captureVideo: 'Capture Video',
        sendAudio: 'Send audio record',
      },
      unsupportedFileType: 'Unsupported file type',
      fileExceededLimit: 'File exceeds the ${size} limit',
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
        insertMember: 'Insert  Member',
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
      insertMember: {
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
          submit: 'Insert ',
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
          submit: 'Change',
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
        message: 'Do you want to remove member {member}?',
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
    searchPlaceholder: 'Search...',
    fetchMore: 'Fetch More',
    roomTypes: {
      group: 'Group',
      private: 'Private',
    },
    displayMessage: {
      you: 'You',
      removedMember: 'Removed Member',
      sent: 'sent {type}',
      types: {
        images: '{length} image | {length} images',
        files: '{length} file | {length} files',
        audios: '{length} audio | {length} audios',
        videos: '{length} video | {length} videos',
        none: 'message has been deleted',
      },
    },
  },
};
