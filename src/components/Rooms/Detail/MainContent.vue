<template>
  <v-sheet
    id="chat-main"
    class="wrapper flex-grow-1 flex-shrink-1"
    min-height="320"
  >
    <div
      ref="messagesRef"
      class="content overflow-y-auto overflow-x-hidden d-flex flex-column-reverse pa-2 scroll-smooth"
    >
      <typing-users ref="typingUsersRef" />

      <!-- messages -->
      <message-content
        v-for="(message, index) in messages"
        :key="message.id"
        :index="index"
        :message="message"
        :is-loading-action="isLoadingDeleteMessage"
        @remove-message="requestDeleteMessage"
      ></message-content>

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
      class="ma-2 position-absolute"
      :class="{ 'd-none': !emojiPickerShow }"
      @select="selectEmoji"
      :style="{
        right: $vuetify.display.mdAndUp ? '3.5rem' : '0',
        bottom: '0',
      }"
    />
  </v-sheet>

  <message-input
    ref="messageInputRef"
    v-model:emoji-picker-show="emojiPickerShow"
    @unshift-message="unshiftMessage"
    @goto-last-message="gotoLastMessage"
    @typing="onTyping"
  />

  <v-overlay
    :model-value="!!selectedMessageImageSrc"
    class="align-center justify-center"
    persistent
  >
    <v-btn
      position="absolute"
      icon="mdi-close"
      location="top right"
      size="x-small"
      variant="flat"
      class="ma-2"
      @click="selectedMessageImageSrc = undefined"
    ></v-btn>
    <div class="wrapper-image" @click="selectedMessageImageSrc = undefined">
      <v-img :src="selectedMessageImageSrc" />
    </div>
  </v-overlay>
</template>

<script lang="ts" setup>
import 'emoji-mart-vue-fast/css/emoji-mart.css';

import { useScroll } from '@vueuse/core';
import data from 'emoji-mart-vue-fast/data/twitter.json';
// @ts-ignore
import { EmojiIndex, Picker as EmojiPicker } from 'emoji-mart-vue-fast/src';
import _ from 'lodash';
import { computed, inject, provide, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

import MessageContent from '@/components/Rooms/Detail/MessageContent.vue';
import MessageInput from '@/components/Rooms/Detail/MessageInput.vue';
import TypingUsers from '@/components/Rooms/Detail/TypingUsers.vue';
import { useSocketChat } from '@/composables/useSocketChat';
import { useSocketEventListener } from '@/composables/useSocketEventListener';
import { KEYS } from '@/constants';
import {
  IDeleteRoomMessageRequest,
  IRoomMessageResponse,
  ISearchRoomMessagesRequest,
} from '@/interfaces/rooms';

const socket = useSocketChat();

const route = useRoute();

const roomId = computed<string>(() => route.params.roomId as string);
const room = inject(KEYS.CHAT.ROOM)!;

const messagesRef = ref<HTMLDivElement>();
const messages = ref<Array<IRoomMessageResponse>>([]);

const isAllMessagesLoaded = ref<boolean>(false);

const { request: requestMessages, isLoading } = useSocketEventListener<
  { messages: Array<IRoomMessageResponse> },
  ISearchRoomMessagesRequest
>(socket, 'list:message', {
  response({ messages: data }) {
    messages.value = _.uniqBy(
      [...messages.value, ...data],
      (message) => message.id,
    );

    if (!data.length) {
      isAllMessagesLoaded.value = true;
    }
  },
  exception(error) {
    console.error(error);
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

const isIntersecting = ref<boolean>(false);

function onIntersect(
  current: boolean,
  _entries: Array<IntersectionObserverEntry>,
  _observer: IntersectionObserver,
) {
  isIntersecting.value = current;
}

const { y: scrollMessages } = useScroll(messagesRef);

const isDisplayGotoLastMessage = computed(() => scrollMessages.value < -120);

function gotoLastMessage() {
  if (!messagesRef.value) {
    return;
  }

  messagesRef.value.scrollTop = 0;
}

watch(
  [isIntersecting, isLoading, isAllMessagesLoaded],
  ([intersecting, loading, allMessagesLoaded]) => {
    if (intersecting && !loading && !allMessagesLoaded) {
      fetchMoreMessages();
    }
  },
);

const messageInputRef = ref<InstanceType<typeof MessageInput>>();

const emojiIndex = new EmojiIndex(data);
const emojiPickerShow = ref(false);

async function selectEmoji(params: { native: string }) {
  messageInputRef.value?.selectEmoji(params.native);
}

function unshiftMessage(data: IRoomMessageResponse) {
  if (data.room.id !== room.value?.id) {
    return;
  }

  room.value.lastActivatedAt = data.room.lastActivatedAt;
  messages.value = _.uniqBy([data, ...messages.value], (message) => message.id);
}

function removeMessage(data: IRoomMessageResponse) {
  if (data.room.id !== room.value?.id) {
    return;
  }

  const index = _.findIndex(
    messages.value,
    (message) => message.id === data.id,
  );

  if (index < 0) {
    return;
  }
  messages.value.splice(index, 1, data);
}

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

        console.error(error);
      },
    },
  );

const typingUsersRef = ref<InstanceType<typeof TypingUsers>>();

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

  .content {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
  }
}

.wrapper-image {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 4.5rem;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  padding-bottom: 1.5rem;
  height: calc(100vh);
  width: calc(100vw);
}
</style>
