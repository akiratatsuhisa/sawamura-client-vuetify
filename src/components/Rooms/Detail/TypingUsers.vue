<template>
  <v-slide-x-transition>
    <div v-if="_.size(displayUsers)" class="d-flex mt-2 align-center">
      <template
        v-for="({ member, name }, userId) in displayUsers"
        :key="userId"
      >
        <v-typing-users-avatar :name="name" :member="member" />
      </template>
      <v-sheet
        class="typing pa-2 ml-2 rounded-pill"
        :class="[
          $vuetify.theme.name === 'dark'
            ? 'bg-grey-darken-3'
            : 'bg-grey-lighten-3',
        ]"
        elevation="4"
      >
        <span
          v-for="index in 3"
          :key="index"
          :style="{
            'animation-delay': `${index * 0.5}s`,
          }"
        ></span>
      </v-sheet>
    </div>
  </v-slide-x-transition>
</template>

<script lang="ts" setup>
import { useDebounceFn } from '@vueuse/core';
import dayjs from 'dayjs';
import _ from 'lodash';
import { computed, inject, reactive, watch } from 'vue';

import VTypingUsersAvatar from '@/components/Rooms/Detail/TypingUsersAvatar.vue';
import { useRoom, useSocketChat } from '@/composables';
import { KEYS } from '@/constants';
import { IRoomUserResponse } from '@/interfaces';

const room = inject(KEYS.CHAT.ROOM)!;

const { currentMember, roomMembers } = useRoom(room);

const socket = useSocketChat();

const typingUsers = reactive<Record<string, number>>({});

const displayUsers = computed(() => {
  const obj: Record<string, { name: string; member: IRoomUserResponse }> = {};

  for (const userId in typingUsers) {
    const roomMember = roomMembers.value.find((member) => member.id === userId);
    if (!roomMember) {
      continue;
    }

    obj[userId] = {
      name: roomMember.nickName ?? roomMember.member.displayName,
      member: roomMember.member,
    };
  }

  return obj;
});

const typeDebounce = useDebounceFn(() => {
  for (const key in typingUsers) {
    delete typingUsers[key];
  }
}, 1250);

function handleTyping(data: { userId: string }) {
  if (data.userId === currentMember.value?.id) {
    return;
  }

  typingUsers[data.userId] = dayjs().add(1000, 'millisecond').valueOf();

  for (const [key, value] of Object.entries(typingUsers)) {
    if (dayjs(value).isBefore(dayjs())) {
      delete typingUsers[key];
    }
  }

  typeDebounce();
}

watch(
  () => room.value.id,
  (id, _prev, onCleanup) => {
    if (!id) {
      return;
    }

    const event = `typing:room:${id}`;

    socket.value.on(event, handleTyping);

    onCleanup(() => {
      socket.value.off(event);
    });
  },
  { immediate: true },
);

function onTyping() {
  socket.value.emit(`typing:room`, {
    roomId: room.value.id,
    userId: currentMember.value?.id,
  });
}

defineExpose({ onTyping });
</script>

<style lang="scss" scoped>
.typing {
  display: flex;

  span {
    width: 0.5rem;
    height: 0.5rem;
    background-color: #acacac33;
    border-radius: 9999px;

    & + span {
      margin-left: 0.25rem;
    }

    animation: dot-flashing 1s infinite alternate;
  }
}

@keyframes dot-flashing {
  0% {
    background-color: #acacac;
  }
  50%,
  100% {
    background-color: #acacac33;
  }
}
</style>
