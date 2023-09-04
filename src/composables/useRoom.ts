import { MaybeRef, useLocalStorage, useTimeAgo } from '@vueuse/core';
import dayjs from 'dayjs';
import _ from 'lodash';
import { computed, unref } from 'vue';

import { useAuth, usePageLocale } from '@/composables';
import {
  IRoomMemberResponse,
  IRoomMessageResponse,
  IRoomResponse,
  IRoomUserResponse,
} from '@/interfaces';

export function getPhotoUrlByRoomUser(user: IRoomUserResponse) {
  return user.photoUrl
    ? `${import.meta.env.VITE_API_URL}/auth/photo?username=${user.username}`
    : import.meta.env.VITE_NO_AVATAR_URL;
}

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

  const updatedImages = useLocalStorage<{
    [key: string]: { photo: string; cover: string };
  }>('list:room:images', {});

  const roomPhotoUrl = computed(() => {
    const unwrapRoom = unref(room);

    if (!unwrapRoom.isGroup) {
      return targetMember.value?.member.photoUrl
        ? `${import.meta.env.VITE_API_URL}/auth/photo?username=${
            targetMember.value.member.username
          }`
        : import.meta.env.VITE_NO_AVATAR_URL;
    }

    return unwrapRoom.photoUrl
      ? `${import.meta.env.VITE_API_URL}/rooms/${unwrapRoom.id}/photo` +
          (updatedImages.value[unwrapRoom.id]?.photo
            ? `?updated=${updatedImages.value[unwrapRoom.id].photo}`
            : '')
      : import.meta.env.VITE_NO_BACKGROUND_URL;
  });

  function updateImage(type: 'photo' | 'cover') {
    if (!updatedImages.value[unref(room).id]) {
      updatedImages.value[unref(room).id] = { photo: '', cover: '' };
    }

    updatedImages.value[unref(room).id][type] = dayjs().unix().toString();
  }

  const roomCoverUrl = computed(() => {
    const unwrapRoom = unref(room);

    return unwrapRoom.coverUrl
      ? `${import.meta.env.VITE_API_URL}/rooms/${unwrapRoom.id}/cover` +
          (updatedImages.value[unwrapRoom.id]?.cover
            ? `?updated=${updatedImages.value[unwrapRoom.id].cover}`
            : '')
      : '';
  });

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
    updateImage,
    getPhotoUrlByRoomUser,
  };
}
