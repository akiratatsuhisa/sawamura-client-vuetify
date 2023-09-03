<template>
  <v-sheet
    id="chat-main"
    class="wrapper flex-grow-1 flex-shrink-1"
    min-height="320"
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
        ></v-btn>
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
          elevation="6"
          size="small"
          icon="mdi-arrow-down"
          @click="gotoLastMessage"
        ></v-btn>
      </v-fab-transition>
    </v-sheet>

    <emoji-picker
      :data="emojiIndex"
      set="twitter"
      class="ma-2 position-absolute rounded-xl elevation-2"
      :class="{ 'd-none': !emojiPickerShow }"
      :style="{
        right: $vuetify.display.mdAndUp ? '3.5rem' : '0',
        bottom: '0',
      }"
      @select="selectEmoji"
    />
  </v-sheet>

  <v-message-input
    ref="messageInputRef"
    v-model:emoji-picker-show="emojiPickerShow"
    @send="onSendMessage"
    @goto-last-message="gotoLastMessage"
    @typing="onTyping"
  />

  <v-main-content-display-image v-model="selectedMessageImageSrc" />
</template>

<script lang="ts" setup>
import 'emoji-mart-vue-fast/css/emoji-mart.css';

import { useScroll } from '@vueuse/core';
import data from 'emoji-mart-vue-fast/data/twitter.json';
// @ts-ignore
import { EmojiIndex, Picker as EmojiPicker } from 'emoji-mart-vue-fast/src';
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

import VMainContentDisplayImage from '@/components/Rooms/Detail/MainContentDisplayImage.vue';
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
  () => import('@/components/Rooms/Detail/MessageContent.vue'),
);
const VMessageInput = defineAsyncComponent(
  () => import('@/components/Rooms/Detail/MessageInput.vue'),
);
const VTypingUsers = defineAsyncComponent(
  () => import('@/components/Rooms/Detail/TypingUsers.vue'),
);

const { updateListRoom } = useRoomsStore();

const route = useRoute();
const { createSnackbarError } = useSnackbar();

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
>(socket, 'list:message', {
  response({ messages: data }) {
    messages.value = uniqBy(
      [...messages.value, ...data],
      (message) => message.id,
    );

    if (!data.length) {
      isAllMessagesLoaded.value = true;
    }
  },
  exception(error) {
    createSnackbarError(error.message);
  },
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

const messageInputRef = ref<InstanceType<typeof VMessageInput>>();
const emojiIndex = new EmojiIndex(data);
const emojiPickerShow = ref(false);

async function selectEmoji(params: { native: string }) {
  messageInputRef.value?.selectEmoji(params.native);
}

function createMessage(data: IRoomMessageResponse) {
  updateListRoom(data.room);
  if (data.room.id !== room.value?.id) {
    return;
  }

  room.value.lastActivatedAt = data.room.lastActivatedAt;
  messages.value = uniqBy([data, ...messages.value], (message) => message.id);
}

function removeMessage(data: IRoomMessageResponse) {
  updateListRoom(data.room);
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
>(socket, 'create:message', {
  response: createMessage,
  listener: createMessage,
  exception(error) {
    if (error.data.roomId !== room.value?.id) {
      return;
    }

    createSnackbarError(error.message);
  },
});

const { request: requestDeleteMessage, isLoading: isLoadingDeleteMessage } =
  useSocketEventListener<IRoomMessageResponse, IDeleteRoomMessageRequest>(
    socket,
    'delete:message',
    {
      response: removeMessage,
      listener: removeMessage,
      exception(error) {
        if (error.data.roomId !== room.value?.id) {
          return;
        }

        createSnackbarError(error.message);
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
