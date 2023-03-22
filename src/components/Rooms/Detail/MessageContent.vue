<template>
  <div
    class="d-flex flex-nowrap mt-2"
    :class="[isCurrentUserMessage ? 'flex-row-reverse' : 'flex-row']"
  >
    <v-avatar
      class="align-self-end"
      size="28"
      :image="`https://i.pravatar.cc/150?img=${index}`"
    >
    </v-avatar>

    <v-tooltip
      :text="timeAgo"
      :location="isCurrentUserMessage ? 'left' : 'right'"
    >
      <template v-slot:activator="{ props: tooltipProps }">
        <div class="px-2 flex-shrink-1" v-bind="tooltipProps">
          <v-card
            v-if="message.type === 'Text'"
            rounded="xl"
            class="text-pre-wrap text-break"
          >
            <v-card-text>
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
            <div v-if="files.length" class="pa-1 files">
              <message-file-content
                v-for="file in files"
                :key="file.uuid"
                :type="message.type"
                :file="file"
              />
            </div>
            <v-card v-else rounded="xl">
              <v-card-text class="text-grey-lighten-1">
                File(s) has error
              </v-card-text>
            </v-card>
          </div>
          <v-card v-else rounded="xl">
            <v-card-text class="text-grey-lighten-1">
              Message has been deleted
            </v-card-text>
          </v-card>
        </div>
      </template>
    </v-tooltip>

    <v-menu v-if="message.type !== 'None'">
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
      <v-list>
        <v-list-item
          append-icon="mdi-trash-can-outline"
          title="Delete"
          @click="emit('remove', message.id)"
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

import MessageFileContent from '@/components/Rooms/Detail/MessageFileContent.vue';
import { useAuth } from '@/composables/useAuth';
import {
  IRoomMessageFileResponse,
  IRoomMessageResponse,
} from '@/interfaces/rooms';

const props = defineProps<{
  index: number;
  message: IRoomMessageResponse;
  isLoadingAction: boolean;
}>();

const emit = defineEmits<{
  (event: 'remove', value: string): void;
}>();

const { identityId } = useAuth();

const isCurrentUserMessage = computed(
  () => identityId.value === props.message.user.id,
);

const timeAgo = useTimeAgo(props.message.createdAt);

const isFileType = computed(
  () =>
    _.some(
      ['Image', 'Images', 'Files', 'Audio', 'Video', 'Media'],
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
</script>

<style lang="scss" scoped>
.files {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: end;
}
</style>
