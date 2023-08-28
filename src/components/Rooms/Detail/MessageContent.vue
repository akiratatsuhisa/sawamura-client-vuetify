<template>
  <div
    class="d-flex flex-nowrap mt-2"
    :class="[isCurrentUserMessage ? 'flex-row-reverse' : 'flex-row']"
  >
    <v-avatar
      color="secondary-container"
      class="align-self-end elevation-4 mb-1"
      size="28"
      :image="photoUrl"
    >
    </v-avatar>

    <v-tooltip
      :text="timeAgo"
      :location="isCurrentUserMessage ? 'left center' : 'right center'"
    >
      <template v-slot:activator="{ props: tooltipProps }">
        <div class="px-2 flex-shrink-1" v-bind="tooltipProps">
          <v-card
            v-if="message.type === 'Text'"
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
      v-if="message.type !== 'None'"
      :location="isCurrentUserMessage ? 'left center' : 'right center'"
    >
      <template v-slot:activator="{ props }">
        <v-btn
          class="align-self-center"
          icon="mdi-dots-vertical"
          variant="plain"
          size="x-small"
          v-bind="props"
          :loading="isLoadingAction"
        ></v-btn>
      </template>

      <v-list class="bg-surface-variant text-on-surface-variant" rounded="xl">
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
import { computed } from 'vue';

import VMessageContentFile from '@/components/Rooms/Detail/MessageContentFile.vue';
import { useAuth, usePageLocale } from '@/composables';
import {
  IDeleteRoomMessageRequest,
  IRoomMessageFileResponse,
  IRoomMessageResponse,
} from '@/interfaces';

const props = defineProps<{
  index: number;
  message: IRoomMessageResponse;
  isLoadingAction: boolean;
}>();

const emit = defineEmits<{
  (event: 'removeMessage', data: IDeleteRoomMessageRequest): void;
}>();

const { translate } = usePageLocale({ prefix: 'messages.room.messages' });

const { identityId } = useAuth();

const isCurrentUserMessage = computed(
  () => identityId.value === props.message.user.id,
);

const photoUrl = computed(() =>
  props.message.user.photoUrl
    ? `${import.meta.env.VITE_API_URL}/auth/photo?username=${
        props.message.user.username
      }`
    : import.meta.env.VITE_NO_AVATAR_URL,
);

const timeAgo = useTimeAgo(props.message.createdAt);

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
