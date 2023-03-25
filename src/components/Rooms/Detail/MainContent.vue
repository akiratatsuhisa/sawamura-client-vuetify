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

  <v-card variant="flat" rounded="0" ref="messageZoneRef">
    <div v-if="filesInput.length">
      <v-sheet
        class="pa-2 pt-3 files"
        :class="[isDark ? 'bg-grey-darken-3' : 'bg-grey-lighten-5']"
      >
        <message-file-input
          v-for="file in filesInput"
          :key="file.id"
          :file="file"
          @remove-file="removeFile"
        />
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

    <v-overlay
      :model-value="isOverDropScreen"
      contained
      class="align-center justify-center"
    >
      <span class="text-h6" :class="{ 'text-primary': isOverDropMessage }">
        Drop file(s) here!
      </span>
    </v-overlay>
  </v-card>
</template>

<script lang="ts" setup>
import 'emoji-mart-vue-fast/css/emoji-mart.css';

import { useDropZone } from '@vueuse/core';
import data from 'emoji-mart-vue-fast/data/twitter.json';
// @ts-ignore
import { EmojiIndex, Picker as EmojiPicker } from 'emoji-mart-vue-fast/src';
import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import {
  ComponentPublicInstance,
  computed,
  inject,
  nextTick,
  reactive,
  ref,
  watch,
} from 'vue';
import { useRoute } from 'vue-router';
import { VCard, VTextField } from 'vuetify/components';

import MessageContent from '@/components/Rooms/Detail/MessageContent.vue';
import MessageFileInput from '@/components/Rooms/Detail/MessageFileInput.vue';
import { useSocketChat } from '@/composables/useSocketChat';
import { useSocketEventListener } from '@/composables/useSocketEventListener';
import { KEYS, MESSAGE_FILE } from '@/constants';
import {
  BasicFile,
  BasicFileType,
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

const messageZoneRef = ref();

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

const filesInput = reactive<Array<BasicFile>>([]);

function selectFiles(files?: FileList | File[] | null) {
  _.forEach(files, (file) => {
    if (!file || file.size > MESSAGE_FILE.MAX_FILE_SIZE) {
      console.error(
        `file size must be less than or equals ${MESSAGE_FILE.MAX_FILE_SIZE} bytes`,
      );
      return;
    }

    const type: BasicFileType | null = MESSAGE_FILE.IMAGE_MIME_TYPES.test(
      file.type,
    )
      ? 'images'
      : MESSAGE_FILE.OFFICE_MIME_TYPES.test(file.type)
      ? 'files'
      : null;

    if (_.isNull(type)) {
      console.error('Invalid file type');
      return;
    }

    filesInput.push({
      id: uuidv4(),
      type,
      src: URL.createObjectURL(file),
      file,
    });
  });
}

function pasteMessage(event: ClipboardEvent) {
  const clipboardData = event.clipboardData!;

  if (clipboardData?.types.includes('text/plain')) {
    return;
  }

  event.preventDefault();
  selectFiles(clipboardData?.files);
}

function removeFile(id: string) {
  _.remove(filesInput, (file) => file.id === id);
}

const { isOverDropZone: isOverDropScreen } = useDropZone(document.body);
const { isOverDropZone: isOverDropMessage } = useDropZone(
  messageZoneRef,
  selectFiles,
);

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
  messageInput.value = messageInput.value.trim();

  if (!messageInput.value && !filesInput.length) {
    return;
  }

  requestCreateMessage({
    roomId: roomId.value,
    content: messageInput.value,
    files: !filesInput.length
      ? undefined
      : _.map(filesInput, ({ file }) => ({
          name: file.name,
          data: file,
        })),
  });

  filesInput.splice(0, filesInput.length);
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

.files {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  column-gap: 0.75rem;
  overflow-x: auto;
  overflow-y: hidden;
}
</style>
