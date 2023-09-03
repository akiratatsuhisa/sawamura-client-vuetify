import { AxiosInstance } from 'axios';
import { Manager, Socket } from 'socket.io-client';
import {
  DeepReadonly,
  InjectionKey,
  Ref,
  ShallowRef,
  WritableComputedRef,
} from 'vue';
import { RouteLocationNamedRaw } from 'vue-router';

import { AlertProps, SnackbarProps } from '@/composables';
import { IRoomMemberResponse, IRoomResponse } from '@/interfaces';

export namespace KEYS {
  export const AXIOS: InjectionKey<AxiosInstance> = Symbol('axios');

  export const ALERTS: InjectionKey<Array<AlertProps>> = Symbol('alerts');
  export const SNACKBARS: InjectionKey<Array<SnackbarProps>> =
    Symbol('snackbars');

  export const MANAGER_SOCKETS: InjectionKey<Manager> =
    Symbol('manager:sockets');

  export const SOCKET_CHAT: InjectionKey<ShallowRef<Socket>> =
    Symbol('socket:chat');

  export const SOCKET_DASHBOARD: InjectionKey<ShallowRef<Socket>> =
    Symbol('socket:dashboard');

  export const SOCKET_NOTIFICATIONS: InjectionKey<ShallowRef<Socket>> = Symbol(
    'socket:notifications',
  );

  export namespace DRAWER {
    export const SHOW: InjectionKey<Ref<boolean | null>> =
      Symbol('drawer:show');
    export const IS_ACTIVE: InjectionKey<
      (item: RouteLocationNamedRaw, prefix?: boolean) => boolean
    > = Symbol('drawer:isActive');
  }

  export namespace CHAT {
    export const ROOM: InjectionKey<Ref<IRoomResponse>> = Symbol('chat:room');
    export const CURRENT_MEMBER: InjectionKey<
      DeepReadonly<Ref<IRoomMemberResponse | undefined>>
    > = Symbol('chat:currentMember');
    export const TARGET_MEMBER: InjectionKey<
      DeepReadonly<Ref<IRoomMemberResponse | undefined>>
    > = Symbol('chat:targetMember');
    export const REACTION_ICON: InjectionKey<WritableComputedRef<string>> =
      Symbol('chat:reactionIcon');
    export const SELECT_MESSAGE_IMAGE_SRC: InjectionKey<(src: string) => void> =
      Symbol('chat:selectMessageImageSrc');
  }

  export namespace DASHBOARD {
    export namespace USERS {
      export namespace DIALOGS {
        export namespace CHANGE_ROLES {
          export const ROLE_LIST: InjectionKey<
            DeepReadonly<
              Ref<Array<{ id: string; name: string; default: boolean }>>
            >
          > = Symbol('dashboard:users:dialogs:changeRoles:roleList');
          export const OPEN_DIALOG: InjectionKey<(id: string) => void> = Symbol(
            'dashboard:users:dialogs:changeRoles:openDialog',
          );
        }
      }
    }
  }
}

export namespace MESSAGE_FILE {
  // 25 MiB
  export const MAX_FILE_SIZE = 26_214_400;

  // IMAGE MIME TYPES
  export const IMAGE_MIME_TYPES =
    /image\/(jpe?g|png|gif|bmp|webp|svg\+xml|tiff)/;

  // AUDIO MIME TYPES
  export const AUDIO_MIME_TYPES =
    /audio\/(aac|((x-)?midi)|mp3|mpeg|ogg|opus|wav|webm|3gpp2?)/;

  // VIDEO MIME TYPES
  export const VIDEO_MIME_TYPES = /video\/(x-msvideo|mp4|mpeg|ogg|webm|3gpp2?)/;

  // OFFICE MIME TYPES
  export const MICROSOFT_MIME_TYPES =
    /(application\/((msword|vnd\.openxmlformats-officedocument\.wordprocessingml\.document)|(vnd\.ms-excel|vnd\.openxmlformats-officedocument\.spreadsheetml\.sheet)|(vnd\.ms-powerpoint|vnd\.openxmlformats-officedocument\.presentationml\.presentation)|onenote|vnd\.publisher|vnd\.visio|vnd\.ms-project|vnd\.ms-access))/;
  export const GOOGLE_MIME_TYPES =
    /(application\/(vnd\.google-apps\.document|vnd\.openxmlformats-officedocument\.wordprocessingml\.document|msword)|application\/(vnd\.google-apps\.spreadsheet|vnd\.ms-excel|vnd\.openxmlformats-officedocument\.spreadsheetml\.sheet)|application\/(vnd\.google-apps\.presentation|vnd\.ms-powerpoint|vnd\.openxmlformats-officedocument\.presentationml\.presentation))/;
  export const WPS_MIME_TYPES =
    /(application\/(vnd\.ms-word\.document\.macroEnabled\.12|vnd\.openxmlformats-officedocument\.wordprocessingml\.document)|application\/(vnd\.ms-excel\.sheet\.macroEnabled\.12|vnd\.openxmlformats-officedocument\.spreadsheetml\.sheet)|application\/(vnd\.ms-powerpoint\.presentation\.macroEnabled\.12|vnd\.openxmlformats-officedocument\.presentationml\.presentation))/;
  export const OTHER_MIME_TYPES =
    /(application\/pdf|application\/rtf|text\/plain|text\/csv|text\/html|application\/xml|application\/json)/;

  export const OFFICE_MIME_TYPES = new RegExp(
    [
      MESSAGE_FILE.MICROSOFT_MIME_TYPES.source,
      MESSAGE_FILE.GOOGLE_MIME_TYPES.source,
      MESSAGE_FILE.WPS_MIME_TYPES.source,
      MESSAGE_FILE.OTHER_MIME_TYPES.source,
    ].join('|'),
  );

  // ALL MIME TYPES
  export const ALL_MIME_TYPES = new RegExp(
    [
      MESSAGE_FILE.IMAGE_MIME_TYPES.source,
      MESSAGE_FILE.VIDEO_MIME_TYPES.source,
      MESSAGE_FILE.IMAGE_MIME_TYPES.source,
      MESSAGE_FILE.OFFICE_MIME_TYPES.source,
    ].join('|'),
  );
}

export namespace AUTH_REGEX {
  export const USERNAME = /^[a-zA-Z][a-zA-Z0-9_-]*$/;
  export const PASSWORD =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]+$/;
}
