<template>
  <v-sheet class="wrapper flex-grow-1 flex-shrink-1" min-height="320">
    <v-sheet
      class="content overflow-y-auto overflow-x-hidden d-flex flex-column-reverse pa-2"
    >
      <!-- messages -->
      <message-content
        v-for="(message, index) in messages"
        :key="message.id"
        :index="index"
        :message="message"
        :is-loading-action="isLoadingDeleteMessage"
        @remove="(id) => removeMessage(id)"
      ></message-content>

      <v-sheet class="text-center">
        <v-btn
          variant="plain"
          icon="mdi-arrow-up"
          @click="fetchMoreMessages"
          :loading="isLoading"
        ></v-btn>
      </v-sheet>
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

  <v-divider></v-divider>

  <v-card variant="flat" rounded="0">
    <div v-if="pastedImages.length">
      <v-sheet
        class="pa-2 images"
        :class="[isDark ? 'bg-grey-darken-3' : 'bg-grey-lighten-5']"
      >
        <v-card
          v-for="(image, index) in pastedImages"
          :key="index"
          class="flex-grow-0 flex-shrink-0"
          elevation="4"
        >
          <img height="128" :src="image.src" class="d-block" />
        </v-card>
      </v-sheet>
      <v-divider></v-divider>
    </div>

    <v-card-text>
      <v-textarea
        ref="messageInputRef"
        v-model="messageInput"
        variant="outlined"
        density="compact"
        placeholder="Aa"
        rows="1"
        max-rows="4"
        auto-grow
        hide-details
        append-inner-icon="mdi-emoticon-outline"
        append-icon="mdi-send"
        @click:append-inner="emojiPickerShow = !emojiPickerShow"
        @click:append="sendMessage"
        @keypress.exact.enter.prevent="sendMessage"
        @paste="pasteMessage"
      >
      </v-textarea>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import 'emoji-mart-vue-fast/css/emoji-mart.css';

import data from 'emoji-mart-vue-fast/data/twitter.json';
// @ts-ignore
import { EmojiIndex, Picker as EmojiPicker } from 'emoji-mart-vue-fast/src';
import _ from 'lodash';
import {
  ComponentPublicInstance,
  computed,
  inject,
  reactive,
  ref,
  watch,
} from 'vue';
import { nextTick } from 'vue';
import { useRoute } from 'vue-router';
import { VTextField } from 'vuetify/components';

import MessageContent from '@/components/Rooms/Detail/MessageContent.vue';
import { useSocketChat } from '@/composables/useSocketChat';
import { useSocketEventListener } from '@/composables/useSocketEventListener';
import { KEYS } from '@/constants';
import {
  ICreateRoomMessageRequest,
  IDeleteRoomMessageRequest,
  IRoomMessageResponse,
  ISearchRoomMessagesRequest,
} from '@/interfaces/rooms';

const isDark = inject(KEYS.THEMES.IS_DARK)!;

const socket = useSocketChat();

const route = useRoute();
const roomId = computed<string>(() => route.params.roomId as string);
const room = inject(KEYS.CHAT.ROOM)!;

const messages = ref<Array<IRoomMessageResponse>>([]);

const { request: requestMessages, isLoading } = useSocketEventListener<
  { messages: Array<IRoomMessageResponse> },
  ISearchRoomMessagesRequest
>(socket, 'list:message', {
  response({ messages: data }) {
    messages.value = _.uniqBy(
      [...messages.value, ...data],
      (message) => message.id,
    );
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
    messages.value = [];
    requestMessages({
      roomId,
      take: 10,
    });
  },
  { immediate: true },
);

function unshiftMessage(data: IRoomMessageResponse) {
  if (data.room.id !== room.value?.id) {
    return;
  }

  messages.value = _.uniqBy([data, ...messages.value], (message) => message.id);
}

const messageInput = ref('');
const messageInputRef = ref<ComponentPublicInstance<VTextField>>();
const messageTextAreaElement = computed(() =>
  (messageInputRef.value?.$el as HTMLElement).querySelector('textarea'),
);

const emojiIndex = new EmojiIndex(data);
const emojiPickerShow = ref(false);

async function selectEmoji(params: { native: string }) {
  messageInput.value =
    messageInput.value.substring(
      0,
      messageTextAreaElement.value?.selectionStart || messageInput.value.length,
    ) +
    params.native +
    messageInput.value.substring(
      messageTextAreaElement.value?.selectionEnd || messageInput.value.length,
      messageInput.value.length,
    );

  emojiPickerShow.value = false;
  await nextTick();
  messageTextAreaElement.value!.focus();
}

const pastedImages = reactive<
  Array<{
    src: string;
    file: File;
  }>
>([]);

function pasteMessage(event: ClipboardEvent) {
  const clipboardData = event.clipboardData!;

  if (clipboardData?.types.includes('text/plain')) {
    return;
  }
  event.preventDefault();

  const file = clipboardData?.files.item(0);
  console.log(file?.size);
  if (file && /^image\/(png|jpe?g|gif)$/.test(file.type)) {
    pastedImages.push({
      src: URL.createObjectURL(file),
      file,
    });
  }
}

const { request: requestCreateMessage } = useSocketEventListener<
  IRoomMessageResponse,
  ICreateRoomMessageRequest
>(socket, 'create:message', {
  response: unshiftMessage,
  listener: unshiftMessage,
  exception(error) {
    if (error.data.roomId !== room.value?.id) {
      return;
    }

    console.error(error);
  },
});

function sendMessage() {
  if (!messageInput.value && !pastedImages.length) {
    return;
  }
  requestCreateMessage({
    roomId: roomId.value,
    content: messageInput.value,
    files: !pastedImages.length
      ? undefined
      : _.map(pastedImages, ({ file }) => ({
          name: file.name,
          data: file,
        })),
  });

  pastedImages.splice(0, pastedImages.length);
  messageInput.value = '';
}

function updateRemoveMessage(data: IRoomMessageResponse) {
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
      response: updateRemoveMessage,
      listener: updateRemoveMessage,
      exception(error) {
        if (error.data.roomId !== room.value?.id) {
          return;
        }

        console.error(error);
      },
    },
  );

function removeMessage(id: string) {
  requestDeleteMessage({
    id,
    roomId: roomId.value,
  });
}
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

.images {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  gap: 0.5rem;
  overflow-x: auto;
  overflow-y: hidden;
}
</style>
