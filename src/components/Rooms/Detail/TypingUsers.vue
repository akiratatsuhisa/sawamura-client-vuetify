<template>
  <v-slide-x-transition>
    <div v-if="_.size(displayUsers)" class="d-flex mt-2 align-center">
      <template
        v-for="({ photoUrl, name }, userId) in displayUsers"
        :key="userId"
      >
        <v-tooltip :text="name" location="top center">
          <template v-slot:activator="{ props }">
            <v-avatar
              color="secondary-container"
              class="avatar"
              :image="photoUrl"
              v-bind="props"
              size="20"
            ></v-avatar>
          </template>
        </v-tooltip>
      </template>
      <v-sheet
        class="typing pa-2 ml-2 rounded-pill"
        :class="[
          $vuetify.theme.current.dark
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
import _ from 'lodash';
import moment from 'moment';
import { computed, inject, reactive, watch } from 'vue';

import { useRoom } from '@/composables/useRoom';
import { useSocketChat } from '@/composables/useSocketChat';
import { KEYS } from '@/constants';

const room = inject(KEYS.CHAT.ROOM)!;

const { currentMember, roomMembers, getPhotoUrlByRoomUser } = useRoom(room);

const socket = useSocketChat();

const typingUsers = reactive<Record<string, number>>({});

const displayUsers = computed(() => {
  const obj: Record<string, { name: string; photoUrl: string }> = {};

  for (const userId in typingUsers) {
    const roomMember = roomMembers.value.find((member) => member.id === userId);
    if (!roomMember) {
      continue;
    }

    obj[userId] = {
      name: roomMember.nickName ?? roomMember.member.username,
      photoUrl: getPhotoUrlByRoomUser(roomMember.member),
    };
  }

  return obj;
});

const debouncedTyping = useDebounceFn(() => {
  for (const key in typingUsers) {
    delete typingUsers[key];
  }
}, 1250);

function handleTyping(data: { userId: string }) {
  if (data.userId === currentMember.value?.id) {
    return;
  }

  typingUsers[data.userId] = moment().add('1000', 'millisecond').valueOf();

  for (const [key, value] of Object.entries(typingUsers)) {
    if (moment(value).isBefore(moment())) {
      delete typingUsers[key];
    }
  }

  debouncedTyping();
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
.avatar:not(:first-child) {
  margin-left: -8px;
}

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
