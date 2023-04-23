import { MaybeRef, useTimeAgo } from '@vueuse/core';
import _ from 'lodash';
import moment from 'moment';
import { computed, ref, unref } from 'vue';

import { IRoomResponse, IRoomUserResponse } from '@/interfaces/rooms';

import { useAuth } from './useAuth';

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

  const updatedPhoto = ref('');

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
          (updatedPhoto.value ? `?updated=${updatedPhoto.value}` : '')
      : import.meta.env.VITE_NO_BACKGROUND_URL;
  });

  function updatePhotoUrl() {
    updatedPhoto.value = moment().unix().toString();
  }

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

  const disyplayLastActivatedAgo = computed(() => {
    return unref(room).lastActivatedAt == null
      ? ''
      : `Last activated: ${lastActivatedAgo.value}`;
  });

  return {
    roomMembers,
    currentMember,
    targetMember,
    displayName,
    disyplayLastActivatedAgo,
    roomPhotoUrl,
    updatePhotoUrl,
    getPhotoUrlByRoomUser,
  };
}
