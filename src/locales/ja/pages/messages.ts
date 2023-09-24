import { LocalePagesMessages } from '@/locales/type/pages/messages';

export const messages: LocalePagesMessages = {
  list: {
    title: 'メッセージ',
    subtitle: 'チャットルーム',
    createGroup: 'グループを追加',
    enterChat: 'チャットに入る',
    dialogs: {
      createGroup: {
        title: 'ルームグループを作成',
        form: {
          name: {
            label: 'ルーム名',
          },
          members: {
            label: 'メンバー',
          },
          submit: '追加',
        },
      },
    },
  },
  room: {
    lastActivated: '最終アクティブ：{lastActivated}',
    messages: {
      menus: {
        delete: '削除',
      },
    },
    input: {
      placeholder: 'あァ',
      actions: {
        sendFiles: 'ファイルを送信',
        captureImage: '画像を撮影',
        captureVideo: '動画を撮影',
        sendAudio: '音声録音を送信',
      },
    },
    menus: {
      basicsInformation: {
        index: '基本情報',
        editName: '名前を編集',
        changePhoto: '写真を変更',
        changeCover: 'カバー画像を変更',
        chooseTheme: 'テーマを選択',
        deleteChat: 'チャットを削除',
        reactionIcon: 'リアクションアイコン',
      },
      support: { index: 'サポート', outGroup: 'グループから退出' },
      members: {
        index: 'メンバー',
        insertMember: 'メンバーを追加',
        profileUser: '個人ページを表示',
        changeNickName: 'ニックネームを変更',
        changeRole: '権限を変更',
        removeMember: 'メンバーを解除',
      },
    },
    dialogs: {
      editName: {
        title: 'ルーム',
        form: {
          id: { label: 'id' },
          name: { label: 'ルーム名' },
          submit: '編集',
        },
      },
      changePhoto: {
        title: '写真を変更',
        form: {
          submit: '変更',
        },
      },
      changeCover: {
        title: 'カバー画像を変更',
        delete: '削除',
        form: {
          submit: '変更',
        },
        alerts: {
          delete: {
            message: 'ルームのカバー画像を削除しますか？',
            cancel: 'キャンセル',
            confirm: '同意',
          },
        },
      },
      chooseTheme: {
        title: 'テーマを選択',
        select: '元の色を選択',
        clear: 'クリア',
        form: {
          submit: '変更',
        },
      },
      deleteChat: {
        title: 'ルーム',
        message: 'このルームを削除しますか？',
        form: {
          id: { label: 'id' },
          submit: '削除',
        },
      },
      reactionIcon: {
        title: 'リアクションアイコン',
        clear: 'クリア',
        form: {
          submit: '選択',
        },
      },
      insertMember: {
        title: 'ルームメンバー',
        form: {
          roomId: {
            label: 'ルームid',
          },
          member: {
            label: 'メンバー',
          },
          role: {
            label: '権限',
          },
          submit: '追加',
        },
      },
      changeNickName: {
        title: 'ルームメンバー',
        form: {
          roomId: {
            label: 'ルームid',
          },
          memberId: {
            label: 'メンバーid',
          },
          nickName: {
            label: 'ニックネーム',
            hint: 'ニックネームをクリアするにはクリアアイコンをクリックしてください',
          },
          submit: '変更',
        },
      },
      changeRole: {
        title: 'ルームメンバー',
        form: {
          roomId: {
            label: 'ルームid',
          },
          memberId: {
            label: 'メンバーid',
          },
          role: {
            label: '権限を変更',
          },
          submit: '変更',
        },
      },
      removeMember: {
        title: 'ルームメンバー',
        message: '{member}を解除しますか？',
        selfMessage: 'このグループから退出しますか？',
        form: {
          roomId: {
            label: 'ルームid',
          },
          memberId: {
            label: 'メンバーid',
          },
          submit: '解除',
        },
      },
    },
  },
  shared: {
    searchPlaceholder: '調べる',
    results: '結果',
    fetchMore: 'さらに読み込む',
    roomTypes: {
      group: 'グループ',
      private: 'プライベート',
    },
    displayMessage: {
      you: 'あなた',
      removedMember: 'メンバーを削除しました',
      sent: '{type}を送信しました',
      types: {
        images: '{length}枚の画像',
        files: '{length}件のファイル',
        audios: '{length}件の音声',
        videos: '{length}件の動画',
        none: 'メッセージが削除されました',
      },
    },
  },
};
