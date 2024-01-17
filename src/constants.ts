import { AxiosInstance } from 'axios';
import { Manager, Socket } from 'socket.io-client';
import {
  DeepReadonly,
  InjectionKey,
  Ref,
  ShallowRef,
  WritableComputedRef,
} from 'vue';

import { AlertProps, SnackbarProps } from '@/composables';
import {
  IProfileUserResponse,
  IRoomMemberResponse,
  IRoomResponse,
  IWhinnyResponse,
} from '@/interfaces';

export enum LoadingState {
  None = 'none',
  Loading = 'loading',
  Percent = 'percent',
}

export namespace KEYS {
  export const THEME_STYLE: InjectionKey<Ref<string | undefined>> =
    Symbol('themeStyle');

  export const AXIOS: InjectionKey<AxiosInstance> = Symbol('axios');

  export const LOADINGS: InjectionKey<Ref<Array<[string, number | boolean]>>> =
    Symbol('loadings');

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

      export namespace ROLES {
        export const SOFTABLE_REF: InjectionKey<Ref<HTMLElement | undefined>> =
          Symbol('dashboard:users:roles:softableRef');
      }
    }
  }

  export namespace USERS {
    export namespace PAGE {
      export const PROFILE_USER: InjectionKey<
        DeepReadonly<Ref<IProfileUserResponse>>
      > = Symbol('users:page:profileUser');

      export const HAS_FOLLOWING: InjectionKey<Ref<boolean>> = Symbol(
        'users:page:hasFollowing',
      );
    }
  }

  export namespace WHINNY {
    export const ON_CREATE: InjectionKey<(data: IWhinnyResponse) => void> =
      Symbol('whinny:onDelete');
    export const ON_DELETE: InjectionKey<(data: IWhinnyResponse) => void> =
      Symbol('whinny:onDelete');
  }
}

export namespace MessageFile {
  // 25 MiB
  export const MAX_FILE_SIZE = 26_214_400;
}
