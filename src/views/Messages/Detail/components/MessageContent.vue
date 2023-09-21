<template>
  <div
    class="d-flex flex-nowrap mt-2"
    :class="[isCurrentUserMessage ? 'flex-row-reverse' : 'flex-row']"
  >
    <v-avatar
      color="secondary-container"
      class="align-self-end elevation-1 mb-1"
      size="28"
      :image="photoUrl"
    >
    </v-avatar>

    <v-tooltip
      :text="timeAgo"
      :location="isCurrentUserMessage ? 'left center' : 'right center'"
    >
      <template #activator="{ props: tooltipProps }">
        <div class="px-2 flex-shrink-1" v-bind="tooltipProps">
          <v-card
            v-if="isStringType"
            rounded="xl"
            class="text-pre-wrap text-break"
            :class="[
              isCurrentUserMessage ? 'bg-primary' : 'bg-primary-container',
            ]"
          >
            <v-card-text class="py-2 px-4">
              {{ message.content }}
            </v-card-text>
          </v-card>
          <div
            v-else-if="message.type === 'Icon' || message.type === 'Icons'"
            class="text-pre-wrap text-break"
            :class="[message.type === 'Icon' ? 'text-h4' : 'text-h5']"
          >
            {{ message.content }}
          </div>
          <div v-else-if="isFileType">
            <div
              v-if="files.length"
              class="files"
              :class="[isCurrentUserMessage ? 'justify-end' : 'justify-start']"
            >
              <v-message-content-file
                v-for="file in files"
                :key="file.uuid"
                :type="message.type"
                :file="file"
                :is-current-user-message="isCurrentUserMessage"
              />
            </div>
            <v-card
              v-else
              rounded="xl"
              :class="[
                isCurrentUserMessage ? 'bg-tertiary' : 'bg-tertiary-container',
              ]"
            >
              <v-card-text>File(s) has error</v-card-text>
            </v-card>
          </div>
          <v-card
            v-else
            rounded="xl"
            :class="[
              isCurrentUserMessage ? 'bg-tertiary' : 'bg-tertiary-container',
            ]"
          >
            <v-card-text>Message has been deleted</v-card-text>
          </v-card>
        </div>
      </template>
    </v-tooltip>

    <v-menu
      v-if="isMessageRemoveable"
      :location="isCurrentUserMessage ? 'left center' : 'right center'"
    >
      <template #activator="{ props }">
        <v-btn
          class="align-self-center"
          icon="mdi-dots-vertical"
          variant="plain"
          size="x-small"
          v-bind="props"
          :loading="isLoadingAction"
        ></v-btn>
      </template>

      <v-list class="bg-surface-container-high text-on-surface" rounded="xl">
        <v-list-item
          append-icon="mdi-trash-can-outline"
          :title="translate('menus.delete')"
          @click="removeMessage"
        />
      </v-list>
    </v-menu>

    <div class="w-25"></div>
  </div>
</template>

<script setup lang="ts">
import { useTimeAgo } from '@vueuse/core';
import _ from 'lodash';
import { computed, inject } from 'vue';

import { usePageLocale, useUserImage } from '@/composables';
import { KEYS } from '@/constants';
import {
  IDeleteRoomMessageRequest,
  IRoomMessageFileResponse,
  IRoomMessageResponse,
} from '@/interfaces';
import VMessageContentFile from '@/views/Messages/Detail/components/MessageContentFile.vue';

const props = defineProps<{
  index: number;
  message: IRoomMessageResponse;
  isLoadingAction: boolean;
}>();

const emit = defineEmits<{
  (event: 'removeMessage', data: IDeleteRoomMessageRequest): void;
}>();

const room = inject(KEYS.CHAT.ROOM)!;

const { translate } = usePageLocale({ prefix: 'messages.room.messages' });

const currentUser = inject(KEYS.CHAT.CURRENT_MEMBER)!;
const isCurrentUserMessage = computed(
  () => currentUser.value?.member.id === props.message.user.id,
);

const photoUrl = useUserImage(
  'photo',
  computed(() => props.message.user),
);

const timeAgo = useTimeAgo(props.message.createdAt);

const isStringType = computed(() => props.message.type === 'Text');
const isFileType = computed(
  () =>
    _.some(
      ['Image', 'Images', 'Files', 'Audios', 'Videos'],
      (type) => props.message.type === type,
    ) && _.isArray(props.message.content),
);

function isValidFile(file: unknown): file is IRoomMessageFileResponse {
  if (!_.isObject(file)) {
    return false;
  }

  if (
    typeof (file as any).name !== 'string' ||
    typeof (file as any).pathDisplay !== 'string' ||
    typeof (file as any).mime !== 'string'
  ) {
    return false;
  }

  return true;
}

const files = computed(() =>
  isFileType.value && _.isArray(props.message.content)
    ? _.filter(props.message.content, isValidFile)
    : [],
);

const isMessageRemoveable = computed(() => {
  if (props.message.type === 'None') {
    return false;
  }
  if (!room.value.isGroup && !isCurrentUserMessage.value) {
    return false;
  }
  if (room.value.isGroup) {
    if (currentUser.value?.role === 'Member' && !isCurrentUserMessage.value) {
      return false;
    }
    if (
      currentUser.value?.role === 'Moderator' &&
      _.find(
        room.value.roomMembers,
        (roomMember) => roomMember.member.id === props.message.user.id,
      )?.role === 'Administrator'
    ) {
      return false;
    }
  }
  return true;
});

function removeMessage() {
  emit('removeMessage', {
    id: props.message.id,
    roomId: props.message.room.id,
  });
}
</script>

<style lang="scss" scoped>
.files {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 0.5rem;
}
</style>
