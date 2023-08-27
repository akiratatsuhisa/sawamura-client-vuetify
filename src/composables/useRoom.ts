import { MaybeRef, useLocalStorage, useTimeAgo } from '@vueuse/core';
import dayjs from 'dayjs';
import _ from 'lodash';
import { computed, unref } from 'vue';

import { useAuth } from '@/composables';
import { IRoomResponse, IRoomUserResponse } from '@/interfaces';

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
      : targetMember.value?.member.username;
  });

  function getPhotoUrlByRoomUser(user: IRoomUserResponse) {
    return user.photoUrl
      ? `${import.meta.env.VITE_API_URL}/auth/photo?username=${user.username}`
      : import.meta.env.VITE_NO_AVATAR_URL;
  }

  const lastActivatedAgo = useTimeAgo(
    computed(() => unref(room).lastActivatedAt ?? ''),
  );

  return {
    roomMembers,
    currentMember,
    targetMember,
    displayName,
    lastActivatedAgo,
    roomPhotoUrl,
    roomCoverUrl,
    updateImage,
    getPhotoUrlByRoomUser,
  };
}
