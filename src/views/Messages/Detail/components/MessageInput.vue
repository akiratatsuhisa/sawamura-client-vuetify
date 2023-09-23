<template>
  <v-divider />

  <v-card ref="messageZoneRef" color="surface" variant="flat" rounded="0">
    <div v-show="!isShowRecord && filesInput.length">
      <v-sheet class="pa-2 pt-3 files bg-surface-container-lowest">
        <v-message-input-file
          v-for="file in filesInput"
          :key="file.id"
          :file="file"
          @remove-file="removeFile"
        />
      </v-sheet>

      <v-divider />
    </div>

    <v-card-text v-show="!isShowRecord">
      <v-textarea
        ref="messageInputRef"
        v-model="messageInput"
        variant="outlined"
        density="compact"
        :placeholder="translate('input.placeholder')"
        rows="1"
        max-rows="4"
        auto-grow
        hide-details
        @keypress.exact.enter.prevent="sendMessage"
        @keypress="onTyping"
        @keydown="onTyping"
        @paste="pasteMessage"
      >
        <template #prepend>
          <div class="mx-n3">
            <v-menu location="top left" :offset="24">
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon
                  size="small"
                  variant="text"
                  @click="() => undefined"
                >
                  <v-icon size="x-large" icon="mdi-dots-vertical-circle" />
                </v-btn>
              </template>
              <v-list
                class="bg-surface-container-high text-on-surface"
                rounded="xl"
              >
                <v-list-item
                  v-for="{ key, title, icon, onClick } in menuActions"
                  :key="key"
                  @click="() => onClick()"
                >
                  <template #prepend>
                    <v-icon :icon="icon" />
                  </template>
                  <v-list-item-title>{{ translate(title) }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
            <v-expand-x-transition
              v-for="{ key, icon, onClick } in actions"
              :key="key"
            >
              <v-btn
                v-if="isShowActions"
                icon
                size="small"
                variant="text"
                @click="onClick"
              >
                <v-icon size="x-large" :icon="icon" />
              </v-btn>
            </v-expand-x-transition>
          </div>
        </template>

        <template #append-inner>
          <v-icon icon="mdi-emoticon-happy" class="cursor-pointer" />

          <v-base-menu
            ref="reactionMenuRef"
            hide-topbar
            :auto-scroll="false"
            width="auto"
            location="top right"
            offset="16"
            #default="{ isDialog }"
          >
            <emoji-picker
              :data="emojiIndex"
              set="twitter"
              class="rounded-xl elevation-2"
              @select="selectEmoji"
              :style="{
                width: isDialog ? 'auto' : '350px',
                height: isDialog ? 'calc(100vh - 48px)' : '420px',
                maxHeight: '420px',
              }"
            />
          </v-base-menu>
        </template>

        <template #append>
          <v-fab-transition mode="out-in">
            <span
              class="v-icon notranslate v-theme--light v-icon--size-default v-icon--clickable reaction-icon"
              v-if="isDisplayReactionIcon"
              @click="sendMessage"
            >
              {{ reactionIcon || '👌' }}
            </span>

            <v-icon v-else icon="mdi-send" @click="sendMessage" />
          </v-fab-transition>
        </template>
      </v-textarea>
    </v-card-text>

    <v-card-text v-if="isShowRecord">
      <v-message-input-record
        v-model="isShowRecord"
        @send-record="sendRecord"
      />
    </v-card-text>

    <v-overlay
      :model-value="!isShowRecord && isOverDropScreen"
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
  computed,
  inject,
  nextTick,
  ref,
  shallowReactive,
  shallowRef,
  watch,
} from 'vue';
import { VTextField } from 'vuetify/components';

import VBaseMenu from '@/components/VBaseMenu.vue';
import { useOpenFileDialog, usePageLocale, useSnackbar } from '@/composables';
import { KEYS, MESSAGE_FILE } from '@/constants';
import { BinaryUnit, Format } from '@/helpers';
import {
  BasicFile,
  BasicFileType,
  ICreateRoomMessageRequest,
} from '@/interfaces';
import VMessageInputFile from '@/views/Messages/Detail/components/MessageInputFile.vue';
import VMessageInputRecord from '@/views/Messages/Detail/components/MessageInputRecord.vue';

const emit = defineEmits<{
  (event: 'send', payload: ICreateRoomMessageRequest): void;
  (event: 'gotoLastMessage'): void;
  (event: 'typing', payload: KeyboardEvent): void;
}>();

const { t, translate } = usePageLocale({
  prefix: 'messages.room',
});

const room = inject(KEYS.CHAT.ROOM)!;

const { createSnackbarWarning } = useSnackbar();

const isShowRecord = ref<boolean>(false);
const filesInput = shallowReactive<Array<BasicFile>>([]);

function pushFile(file: File): BasicFile | undefined {
  if (!file || file.size > MESSAGE_FILE.MAX_FILE_SIZE) {
    createSnackbarWarning(
      t('common.messages.warning.fileExceededLimit', {
        size: Format.binaryUnit(MESSAGE_FILE.MAX_FILE_SIZE, {
          outputUnit: BinaryUnit.Mebibyte,
        }),
      }),
    );
    return;
  }

  const type: BasicFileType | null = MESSAGE_FILE.IMAGE_MIME_TYPES.test(
    file.type,
  )
    ? 'images'
    : MESSAGE_FILE.AUDIO_MIME_TYPES.test(file.type)
    ? 'audios'
    : MESSAGE_FILE.VIDEO_MIME_TYPES.test(file.type)
    ? 'videos'
    : MESSAGE_FILE.OFFICE_MIME_TYPES.test(file.type)
    ? 'files'
    : null;

  if (_.isNull(type)) {
    createSnackbarWarning(t('common.messages.warning.unsupportedFileType'));
    return;
  }

  filesInput.push({
    id: uuidv4(),
    type,
    src: URL.createObjectURL(file),
    file,
  });
}

function removeFile(id: string) {
  const file = _.find(filesInput, (file) => file.id === id);

  if (!file) {
    return;
  }

  URL.revokeObjectURL(file.src);
  _.remove(filesInput, (file) => file.id === id);
}

function selectFiles(files?: FileList | File[] | null) {
  _.forEach(files, pushFile);
}

function pasteMessage(event: ClipboardEvent) {
  const clipboardData = event.clipboardData!;

  if (clipboardData?.types.includes('text/plain')) {
    return;
  }

  event.preventDefault();
  selectFiles(clipboardData?.files);
}

const messageZoneRef = ref();

const { isOverDropZone: isOverDropScreen } = useDropZone(document.body);
const { isOverDropZone: isOverDropMessage } = useDropZone(
  messageZoneRef,
  (files) => {
    if (isShowRecord.value) {
      return;
    }
    selectFiles(files);
  },
);

const messageInput = ref('');
const messageInputRef = ref<InstanceType<typeof VTextField>>();
const messageTextAreaElement = computed(
  () => (messageInputRef.value?.$el as HTMLElement)?.querySelector('textarea'),
);
const isShowActions = computed(() => !_.trim(messageInput.value));

const emojiIndex = new EmojiIndex(data);
const reactionMenuRef = ref<InstanceType<typeof VBaseMenu>>();
const reactionIcon = inject(KEYS.CHAT.REACTION_ICON)!;

async function selectEmoji(params: { native: string }) {
  const emoji = params.native;

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

const isDisplayReactionIcon = computed(
  () => !messageInput.value && !filesInput.length,
);

function clearMessage() {
  isShowRecord.value = false;
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

  emit('send', {
    roomId: room.value.id,
    content: messageInput.value,
    files: !filesInput.length
      ? undefined
      : _.map(filesInput, ({ file }) => ({
          name: file.name,
          type: file.type,
          data: file,
        })),
  });

  clearMessage();
}

function sendRecord(audioFile: File) {
  emit('send', {
    roomId: room.value.id,
    content: '',
    files: [
      {
        name: audioFile.name,
        type: audioFile.type,
        data: audioFile,
      },
    ],
  });
}

watch(
  room,
  () => {
    clearMessage();
  },
  { immediate: true },
);

const openCaptureImageDialog = useOpenFileDialog({
  accept: 'image/*',
  capture: 'enviroment',
  onFileSelected: selectFiles,
});

const openCaptureVideoFileDialog = useOpenFileDialog({
  accept: 'video/*',
  capture: 'enviroment',
  onFileSelected: selectFiles,
});

const openFileDialog = useOpenFileDialog({
  multiple: true,
  onFileSelected: selectFiles,
});

type ActionType = {
  key: string;
  icon: string;
  title: string;
  onClick: Function;
};

const actions = shallowRef<Array<ActionType>>([
  {
    key: 'captureImage',
    icon: 'mdi-image',
    title: 'input.actions.captureImage',
    onClick: openCaptureImageDialog,
  },
  {
    key: 'captureVideo',
    icon: 'mdi-video-vintage',
    title: 'input.actions.captureVideo',
    onClick: openCaptureVideoFileDialog,
  },
  {
    key: 'sendAudio',
    icon: 'mdi-microphone',
    title: 'input.actions.sendAudio',
    onClick: () => (isShowRecord.value = true),
  },
]);

function onTyping(event: KeyboardEvent) {
  emit('typing', event);
  reactionMenuRef.value?.close();
}

const menuActions = computed<Array<ActionType>>(() => [
  {
    key: 'sendFiles',
    icon: 'mdi-file-send',
    title: 'input.actions.sendFiles',
    onClick: openFileDialog,
  },
  ...(!isShowActions.value ? actions.value : []),
]);
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
