import { computedAsync, MaybeRef, useTimeAgo } from '@vueuse/core';
import _ from 'lodash';
import { computed, unref } from 'vue';

import {
  ThemeModeType,
  ThemeStyleType,
  useAuth,
  usePageLocale,
  useThemeModeStorage,
  useThemeStyleStorage,
} from '@/composables';
import {
  IAdvancedRoomResponse,
  IRoomMemberResponse,
  IRoomMessageResponse,
  IRoomResponse,
  IRoomUserResponse,
} from '@/interfaces';
import { axiosInstacne } from '@/services';

const NO_AVATAR_URL = import.meta.env.VITE_NO_AVATAR_URL as string;
const NO_BACKGROUND_URL = import.meta.env.VITE_NO_BACKGROUND_URL as string;

export function getDisplayRoomMemberNameByUser(
  roomMembers: Array<IRoomMemberResponse>,
  user: IRoomUserResponse,
) {
  const { identityId } = useAuth();
  const { translateShared } = usePageLocale({
    prefix: 'messages',
  });

  const roomMember = _(roomMembers).find(
    (roomMember) => roomMember.member.id === user.id,
  );

  return !roomMember
    ? translateShared('displayMessage.removedMember')
    : roomMember.member.id === identityId.value
    ? translateShared('displayMessage.you')
    : roomMember.nickName
    ? roomMember.nickName
    : roomMember.member.displayName;
}

export function getDisplayRoomMessage(
  roomMessage: Omit<IRoomMessageResponse, 'room'>,
) {
  const { t, pathShared, translateShared } = usePageLocale({
    prefix: 'messages',
  });

  function getByType(type: string) {
    const length: number = roomMessage.content?.length ?? 0;

    return translateShared('displayMessage.sent', {
      type: t(
        pathShared(`displayMessage.types.${type}`),
        {
          length: length,
        },
        length,
      ),
    });
  }

  switch (roomMessage.type) {
    case 'Text':
    case 'Icon':
    case 'Icons':
    case 'Link':
      return roomMessage.content;
    case 'Image':
    case 'Images':
      return getByType('images');
    case 'Files':
      return getByType('files');
    case 'Audios':
      return getByType('audios');
    case 'Videos':
      return getByType('videos');
    case 'None':
    default:
      return translateShared('displayMessage.types.none');
  }
}

export function useAdvancedRoom(room: MaybeRef<IAdvancedRoomResponse>) {
  const { identityId } = useAuth();

  const roomMembers = computed(() => {
    const unwrapRoom = unref(room);

    return _.filter(
      unwrapRoom.roomMembers ?? [],
      (roomMember) => roomMember.role !== 'None',
    );
  });
  const currentMember = computed(() => {
    const unwrapRoom = unref(room);

    return _.find(
      unwrapRoom.roomMembers,
      (roomMember) => roomMember.member.id === identityId.value,
    );
  });
  const targetMember = computed(() => {
    const unwrapRoom = unref(room);

    return unwrapRoom.isGroup
      ? undefined
      : _.find(
          unwrapRoom.roomMembers,
          (roomMember) => roomMember.member.id !== identityId.value,
        );
  });

  const roomPhotoUrl = computedAsync(async () => {
    const unwrapRoom = unref(room);
    if (!unwrapRoom.isGroup) {
      if (!targetMember.value?.member.photoUrl) {
        return NO_AVATAR_URL;
      }
      return await axiosInstacne
        .request<string>({
          url: `/profileUsers/${targetMember.value.member.username}/photo`,
        })
        .then((data) => data.data)
        .catch(() => NO_BACKGROUND_URL);
    } else {
      if (!unwrapRoom.photoUrl) {
        return NO_BACKGROUND_URL;
      }
      return await axiosInstacne
        .request<string>({
          url: `/rooms/${unwrapRoom.id}/photo`,
        })
        .then((data) => data.data)
        .catch(() => NO_AVATAR_URL);
    }
  }, '');

  const displayName = computed(() => {
    const unwrapRoom = unref(room);
    return unwrapRoom.isGroup
      ? unwrapRoom.name
      : targetMember.value?.nickName
      ? targetMember.value.nickName
      : targetMember.value?.member.displayName;
  });

  const lastActivatedAgo = useTimeAgo(
    computed(() => unref(room).lastActivatedAt ?? ''),
  );

  const lastMessage = computed(() => unref(room).roomMessages.at(0));

  return {
    roomMembers,
    currentMember,
    targetMember,
    displayName,
    lastActivatedAgo,
    lastMessage,
    roomPhotoUrl,
  };
}

export function useRoom(room: MaybeRef<IRoomResponse>) {
  const { identityId } = useAuth();

  const roomMembers = computed(() => {
    const unwrapRoom = unref(room);

    return _.filter(
      unwrapRoom.roomMembers ?? [],
      (roomMember) => roomMember.role !== 'None',
    );
  });
  const currentMember = computed(() => {
    const unwrapRoom = unref(room);

    return _.find(
      unwrapRoom.roomMembers,
      (roomMember) => roomMember.member.id === identityId.value,
    );
  });
  const targetMember = computed(() => {
    const unwrapRoom = unref(room);

    return unwrapRoom.isGroup
      ? undefined
      : _.find(
          unwrapRoom.roomMembers,
          (roomMember) => roomMember.member.id !== identityId.value,
        );
  });

  const roomPhotoUrl = computedAsync(async () => {
    const unwrapRoom = unref(room);
    if (!unwrapRoom.isGroup) {
      if (!targetMember.value?.member.photoUrl) {
        return NO_AVATAR_URL;
      }
      return await axiosInstacne
        .request<string>({
          url: `/profileUsers/${targetMember.value.member.username}/photo`,
        })
        .then((data) => data.data)
        .catch(() => NO_BACKGROUND_URL);
    } else {
      if (!unwrapRoom.photoUrl) {
        return NO_BACKGROUND_URL;
      }
      return await axiosInstacne
        .request<string>({
          url: `/rooms/${unwrapRoom.id}/photo`,
        })
        .then((data) => data.data)
        .catch(() => NO_AVATAR_URL);
    }
  }, '');
  const roomCoverUrl = computedAsync(async () => {
    const unwrapRoom = unref(room);
    if (!unwrapRoom.coverUrl) {
      return '';
    }
    return await axiosInstacne
      .request<string>({
        url: `/rooms/${unwrapRoom.id}/cover`,
      })
      .then((data) => data.data)
      .catch(() => NO_BACKGROUND_URL);
  }, '');

  const displayName = computed(() => {
    const unwrapRoom = unref(room);
    return unwrapRoom.isGroup
      ? unwrapRoom.name
      : targetMember.value?.nickName
      ? targetMember.value.nickName
      : targetMember.value?.member.displayName;
  });

  const lastActivatedAgo = useTimeAgo(
    computed(() => unref(room).lastActivatedAt ?? ''),
  );

  const lastMessage = computed(() => unref(room).roomMessages.at(0));

  return {
    roomMembers,
    currentMember,
    targetMember,
    displayName,
    lastActivatedAgo,
    lastMessage,
    roomPhotoUrl,
    roomCoverUrl,
  };
}

export function useIsRoomThemeSelectable() {
  const { selectedThemeStyle } = useThemeStyleStorage();
  const { selectedThemeMode } = useThemeModeStorage();

  return computed(
    () =>
      (['default', 'mixed'] as Array<ThemeStyleType>).includes(
        selectedThemeStyle.value,
      ) &&
      (['light', 'dark'] as Array<ThemeModeType>).includes(
        selectedThemeMode.value,
      ),
  );
}
