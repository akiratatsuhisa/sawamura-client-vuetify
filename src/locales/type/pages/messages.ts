export type LocalePagesMessages = {
  list: {
    title: string;
    subtitle: string;
    createGroup: string;
    fetchMore: string;
    dialogs: {
      createGroup: {
        title: string;
        form: {
          name: { label: string };
          members: { label: string };
          submit: string;
        };
      };
    };
  };
  room: {
    /**
     * @param {DateTime} lastActivated
     */
    lastActivated: string;
    messages: {
      menus: {
        delete: string;
      };
    };
    input: {
      placeholder: string;
      actions: {
        sendFiles: string;
        captureImage: string;
        captureVideo: string;
        sendAudio: string;
      };
      unsupportedFileType: string;
      /**
       * @param {string} size
       */
      fileExceededLimit: string;
    };
    menus: {
      basicsInformation: {
        index: string;
        editName: string;
        changePhoto: string;
        changeCover: string;
        chooseTheme: string;
        deleteChat: string;
        reactionIcon: string;
      };
      support: { index: string; outGroup: string };
      members: {
        index: string;
        insertMember: string;
        changeNickName: string;
        changeRole: string;
        removeMember: string;
      };
    };
    dialogs: {
      editName: {
        title: string;
        form: {
          id: { label: string };
          name: { label: string };
          submit: string;
        };
      };
      changePhoto: {
        title: string;
        form: {
          submit: string;
        };
      };
      changeCover: {
        title: string;
        delete: string;
        form: {
          submit: string;
        };
        alerts: {
          delete: {
            message: string;
            cancel: string;
            confirm: string;
          };
        };
      };
      chooseTheme: {
        title: string;
        select: string;
        clear: string;
        form: {
          submit: string;
        };
      };
      deleteChat: {
        title: string;
        message: string;
        form: {
          id: { label: string };
          submit: string;
        };
      };
      reactionIcon: {
        title: string;
        clear: string;
        form: {
          submit: string;
        };
      };
      insertMember: {
        title: string;
        form: {
          roomId: { label: string };
          member: { label: string };
          role: { label: string };
          submit: string;
        };
      };
      changeNickName: {
        title: string;
        form: {
          roomId: { label: string };
          memberId: { label: string };
          nickName: { label: string; hint: string };
          submit: string;
        };
      };
      changeRole: {
        title: string;
        form: {
          roomId: { label: string };
          memberId: { label: string };
          role: { label: string };
          submit: string;
        };
      };
      removeMember: {
        title: string;
        /**
         * @param {string} member
         */
        message: string;
        selfMessage: string;
        form: {
          roomId: { label: string };
          memberId: { label: string };
          submit: string;
        };
      };
    };
  };
  shared: {
    chooseImage: string;
    generateTheme: string;
    roomTypes: {
      group: string;
      private: string;
    };
  };
};
