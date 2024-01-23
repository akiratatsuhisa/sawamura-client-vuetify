<template>
  <v-sheet
    class="wrapper flex-grow-1 flex-shrink-1"
    min-height="200"
    :style="{
      'background-image': roomCoverUrl ? `url(${roomCoverUrl})` : undefined,
    }"
  >
    <div v-if="roomCoverUrl" class="bg-filter"></div>

    <div
      ref="messagesRef"
      class="content overflow-y-auto overflow-x-hidden d-flex flex-column-reverse pa-2 scroll-smooth"
    >
      <v-typing-users ref="typingUsersRef" />

      <!-- messages -->
      <v-message-content
        v-for="(message, index) in messages"
        :key="message.id"
        :index="index"
        :message="message"
        :is-loading-action="isLoadingDeleteMessage"
        @remove-message="requestDeleteMessage"
      />

      <v-sheet
        v-intersect="onIntersect"
        class="text-center mb-auto bg-transparent"
      >
        <v-btn
          variant="plain"
          size="small"
          icon="mdi-arrow-up"
          @click="fetchMoreMessages"
          :loading="isLoading"
        />
      </v-sheet>
    </div>

    <v-sheet
      position="absolute"
      location="bottom center"
      class="pa-2 bg-transparent"
    >
      <v-fab-transition>
        <v-btn
          v-if="isDisplayGotoLastMessage"
          variant="elevated"
          size="small"
          icon="mdi-arrow-down"
          @click="gotoLastMessage"
        />
      </v-fab-transition>
    </v-sheet>
  </v-sheet>

  <v-message-input
    @send="onSendMessage"
    @goto-last-message="gotoLastMessage"
    @typing="onTyping"
  />

  <v-display-image v-model="selectedMessageImageSrc" />
</template>

<script lang="ts" setup>
import { SOCKET_EVENTS } from '@akiratatsuhisa/sawamura-utils';
import { useScroll } from '@vueuse/core';
import findIndex from 'lodash/findIndex';
import uniqBy from 'lodash/uniqBy';
import {
  computed,
  defineAsyncComponent,
  inject,
  provide,
  ref,
  watch,
} from 'vue';
import { useRoute } from 'vue-router';

import VDisplayImage from '@/components/VDisplayImage.vue';
import {
  useFetchIntersection,
  useRoom,
  useSnackbar,
  useSocketChat,
  useSocketEventListener,
} from '@/composables';
import { KEYS } from '@/constants';
import {
  ICreateRoomMessageRequest,
  IDeleteRoomMessageRequest,
  IRoomMessageResponse,
  ISearchRoomMessagesRequest,
} from '@/interfaces';
import { useRoomsStore } from '@/store';

const VMessageContent = defineAsyncComponent(
  () => import('@/views/Messages/Detail/components/MessageContent.vue'),
);
const VMessageInput = defineAsyncComponent(
  () => import('@/views/Messages/Detail/components/MessageInput.vue'),
);
const VTypingUsers = defineAsyncComponent(
  () => import('@/views/Messages/Detail/components/TypingUsers.vue'),
);

const { updateListRoom } = useRoomsStore();

const route = useRoute();
const { createSnackbarByException } = useSnackbar();

const roomId = computed<string>(() => route.params.roomId as string);
const room = inject(KEYS.CHAT.ROOM)!;
const { roomCoverUrl } = useRoom(room);

const messagesRef = ref<HTMLDivElement>();
const messages = ref<Array<IRoomMessageResponse>>([]);
const isAllMessagesLoaded = ref<boolean>(false);

const socket = useSocketChat();

const { request: requestMessages, isLoading } = useSocketEventListener<
  { messages: Array<IRoomMessageResponse> },
  ISearchRoomMessagesRequest
>(socket, SOCKET_EVENTS.ROOM_EVENTS.LIST_MESSAGE, {
  response({ messages: data }) {
    messages.value = uniqBy(
      [...messages.value, ...data],
      (message) => message.id,
    );

    if (!data.length) {
      isAllMessagesLoaded.value = true;
    }
  },
  exception: createSnackbarByException,
});

function fetchMoreMessages() {
  requestMessages({
    roomId: roomId.value,
    take: 10,
    cursor: messages.value.at(-1)?.id,
  });
}

watch(
  roomId,
  (roomId) => {
    if (!roomId) {
      return;
    }

    messages.value = [];
    isAllMessagesLoaded.value = false;
    requestMessages({
      roomId,
      take: 10,
    });
  },
  { immediate: true },
);

const { y: scrollMessages } = useScroll(messagesRef);
const isDisplayGotoLastMessage = computed(() => scrollMessages.value < -120);

function gotoLastMessage() {
  if (!messagesRef.value) {
    return;
  }

  messagesRef.value.scrollTop = 0;
}

const { onIntersect } = useFetchIntersection({
  fetch: fetchMoreMessages,
  ms: 250,
  isLoading,
  isAllLoaded: isAllMessagesLoaded,
});

function createMessage(data: IRoomMessageResponse) {
  if (data.room.id !== room.value?.id) {
    return;
  }

  room.value.lastActivatedAt = data.room.lastActivatedAt;
  messages.value = uniqBy([data, ...messages.value], (message) => message.id);
}

function removeMessage(data: IRoomMessageResponse) {
  if (data.room.id !== room.value?.id) {
    return;
  }

  const index = findIndex(messages.value, (message) => message.id === data.id);

  if (index < 0) {
    return;
  }
  messages.value.splice(index, 1, data);
}

const { request: requestCreateMessage } = useSocketEventListener<
  IRoomMessageResponse,
  ICreateRoomMessageRequest
>(socket, SOCKET_EVENTS.ROOM_EVENTS.CREATE_MESSAGE, {
  response(data) {
    updateListRoom(data.room);
    createMessage(data);
  },
  listener: createMessage,
  exception(error) {
    if (error.data.roomId !== room.value?.id) {
      return;
    }

    createSnackbarByException(error);
  },
});

const { request: requestDeleteMessage, isLoading: isLoadingDeleteMessage } =
  useSocketEventListener<IRoomMessageResponse, IDeleteRoomMessageRequest>(
    socket,
    SOCKET_EVENTS.ROOM_EVENTS.DELETE_MESSAGE,
    {
      response(data) {
        updateListRoom(data.room);
        removeMessage(data);
      },
      listener: removeMessage,
      exception(error) {
        if (error.data.roomId !== room.value?.id) {
          return;
        }

        createSnackbarByException(error);
      },
    },
  );

function onSendMessage(data: ICreateRoomMessageRequest) {
  requestCreateMessage(data);
}

const typingUsersRef = ref<InstanceType<typeof VTypingUsers>>();

function onTyping(event: KeyboardEvent) {
  if (event.code === '13') {
    return;
  }

  typingUsersRef.value?.onTyping();
}

const selectedMessageImageSrc = ref<string>();

function selectMessageImageSrc(src: string) {
  selectedMessageImageSrc.value = src;
}

provide(KEYS.CHAT.SELECT_MESSAGE_IMAGE_SRC, selectMessageImageSrc);
</script>

<style lang="scss" scoped>
.wrapper {
  position: relative;

  .content,
  .bg-filter {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
  }

  &:has(.bg-filter) {
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
  }

  .bg-filter {
    background-color: rgba(var(--v-theme-surface-variant), 0.6);
    backdrop-filter: blur(0.5px);
  }
}
</style>
