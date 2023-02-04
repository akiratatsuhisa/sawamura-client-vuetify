<template>
  <v-info-sidebar v-model:drawer="drawer" :loading="isLoading" />

  <v-main class="fill-height">
    <div class="d-flex flex-column h-100">
      <v-toolbar color="surface">
        <v-app-bar-nav-icon
          :icon="room?.isGroup ? 'mdi-account-group' : 'mdi-account-key'"
        >
        </v-app-bar-nav-icon>

        <v-toolbar-title>{{ room?.name }}</v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn icon @click="drawer = !drawer">
          <v-icon>mdi-information</v-icon>
        </v-btn>
      </v-toolbar>

      <v-divider></v-divider>

      <v-main-content />
    </div>
  </v-main>
</template>

<script lang="ts" setup>
import { useLocalStorage } from "@vueuse/core";
import _ from "lodash";
import { computed, provide, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useDisplay } from "vuetify";

import VInfoSidebar from "@/components/Rooms/Detail/InfoSidebar.vue";
import VMainContent from "@/components/Rooms/Detail/MainContent.vue";
import { useAuth } from "@/composables/useAuth";
import { useSocketChat } from "@/composables/useSocketChat";
import { useSocketEventListener } from "@/composables/useSocketEventListener";
import { KEYS } from "@/constants";
import { IRoomRequest, IRoomResponse } from "@/interfaces/rooms";

const { identityId } = useAuth();
const socket = useSocketChat();

const router = useRouter();
const route = useRoute();

const roomId = computed<string>(() => route.params.roomId as string);

const display = useDisplay();

const drawer = useLocalStorage<boolean>(
  `room:drawer:${roomId.value}`,
  !display.mobile
);

const room = ref<IRoomResponse>();

provide(KEYS.CHAT.ROOM, room);

const currentMember = computed(() =>
  _.find(
    room.value?.roomMembers,
    (roomMember) => roomMember.member.id === identityId.value
  )
);

provide(KEYS.CHAT.CURRENT_MEMBER, currentMember);

const { request: requestRoom, isLoading } = useSocketEventListener<
  IRoomResponse,
  IRoomRequest
>(socket, "read:room", {
  response(data) {
    room.value = data;
  },
  exception() {
    router.push({ name: "Messages" });
  },
});

watch(
  roomId,
  (roomId) => {
    requestRoom({
      id: roomId,
    });
  },
  { immediate: true }
);
</script>
