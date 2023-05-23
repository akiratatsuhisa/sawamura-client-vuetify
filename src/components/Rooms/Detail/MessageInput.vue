<template>
  <v-divider></v-divider>

  <v-sheet ref="messageZoneRef">
    <div v-if="filesInput.length">
      <v-sheet class="pa-2 pt-3 files bg-surface-variant">
        <v-message-input-file
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
        prepend-icon="mdi-file-send"
        append-inner-icon="mdi-emoticon-outline"
        @click:prepend="openFileDialog"
        @click:append-inner="emit('update:emojiPickerShow', !emojiPickerShow)"
        @keypress.exact.enter.prevent="sendMessage"
        @keypress="emit('typing', $event)"
        @paste="pasteMessage"
      >
        <template #append>
          <v-fab-transition mode="out-in">
            <span
              class="v-icon notranslate v-theme--light v-icon--size-default v-icon--clickable reaction-icon"
              v-if="isDisplayReactionIcon"
              @click="sendMessage"
            >
              {{ reactionIcon || '👌' }}
            </span>

            <v-icon v-else icon="mdi-send" @click="sendMessage"></v-icon>
          </v-fab-transition>
        </template>
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
  </v-sheet>
</template>

<script lang="ts" setup>
import { useDropZone, useFileDialog } from '@vueuse/core';
import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { computed, inject, nextTick, ref, shallowReactive, watch } from 'vue';
import { VTextField } from 'vuetify/components';

import VMessageInputFile from '@/components/Rooms/Detail/MessageInputFile.vue';
import { useSocketChat } from '@/composables/useSocketChat';
import { useSocketEventListener } from '@/composables/useSocketEventListener';
import { KEYS, MESSAGE_FILE } from '@/constants';
import {
  BasicFile,
  BasicFileType,
  ICreateRoomMessageRequest,
  IRoomMessageResponse,
} from '@/interfaces/rooms';

defineProps<{ emojiPickerShow: boolean }>();

const emit = defineEmits<{
  (event: 'update:emojiPickerShow', data: boolean): void;
  (event: 'unshiftMessage', data: IRoomMessageResponse): void;
  (event: 'gotoLastMessage'): void;
  (event: 'typing', payload: KeyboardEvent): void;
}>();

const room = inject(KEYS.CHAT.ROOM)!;

const socket = useSocketChat();

const messageZoneRef = ref();

const messageInputRef = ref<InstanceType<typeof VTextField>>();

const messageTextAreaElement = computed(() =>
  (messageInputRef.value?.$el as HTMLElement)?.querySelector('textarea'),
);

const messageInput = ref('');

async function selectEmoji(emoji: string) {
  emit('update:emojiPickerShow', false);

  messageInput.value =
    messageInput.value.substring(
      0,
      messageTextAreaElement.value?.selectionStart || messageInput.value.length,
    ) +
    emoji +
    messageInput.value.substring(
      messageTextAreaElement.value?.selectionEnd || messageInput.value.length,
      messageInput.value.length,
    );

  await nextTick();
  messageTextAreaElement.value!.focus();
}

const filesInput = shallowReactive<Array<BasicFile>>([]);

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
  const file = _.find(filesInput, (file) => file.id === id);

  if (!file) {
    return;
  }

  URL.revokeObjectURL(file.src);
  _.remove(filesInput, (file) => file.id === id);
}

const { isOverDropZone: isOverDropScreen } = useDropZone(document.body);
const { isOverDropZone: isOverDropMessage } = useDropZone(
  messageZoneRef,
  selectFiles,
);

const {
  files: selectFileDialog,
  open: openFileDialog,
  reset: resetFileDialog,
} = useFileDialog({
  multiple: true,
});

watch(selectFileDialog, (files) => {
  if (!files?.length) {
    return;
  }

  selectFiles(files);
  resetFileDialog();
});

const { request: requestCreateMessage } = useSocketEventListener<
  IRoomMessageResponse,
  ICreateRoomMessageRequest
>(socket, 'create:message', {
  response: (data) => emit('unshiftMessage', data),
  listener: (data) => emit('unshiftMessage', data),
  exception(error) {
    if (error.data.roomId !== room.value?.id) {
      return;
    }

    console.error(error);
  },
});

const reactionIcon = inject(KEYS.CHAT.REACTION_ICON)!;

const isDisplayReactionIcon = computed(
  () => !messageInput.value && !filesInput.length,
);

function clearMessage() {
  if (filesInput.length) {
    _.forEach(filesInput, (file) => URL.revokeObjectURL(file.src));
  }
  filesInput.splice(0, filesInput.length);

  messageInput.value = '';
}

function sendMessage() {
  emit('gotoLastMessage');

  messageInput.value = messageInput.value.trim();

  if (isDisplayReactionIcon.value) {
    messageInput.value = reactionIcon.value || '👌';
  }

  requestCreateMessage({
    roomId: room.value.id,
    content: messageInput.value,
    files: !filesInput.length
      ? undefined
      : _.map(filesInput, ({ file }) => ({
          name: file.name,
          data: file,
        })),
  });

  clearMessage();
}

watch(
  room,
  () => {
    clearMessage();
  },
  { immediate: true },
);

defineExpose({
  selectEmoji,
});
</script>

<style lang="scss" scoped>
.reaction-icon {
  opacity: 1;
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
