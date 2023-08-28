<template>
  <v-hover>
    <template v-slot:default="{ isHovering, props }">
      <v-card
        v-bind="props"
        rounded="lg"
        :elevation="isHovering ? 8 : 4"
        class="flex-grow-0 flex-shrink-0"
        :class="[fileType]"
      >
        <div
          v-if="isLoading"
          class="h-100 px-2 d-flex justify-center align-center"
        >
          <v-progress-linear
            v-if="type === 'Audios'"
            indeterminate
            color="primary"
          ></v-progress-linear>
          <v-progress-circular
            v-else
            indeterminate
            color="primary"
          ></v-progress-circular>
        </div>
        <div
          v-else-if="!isLoading && !fileSrc"
          class="h-100 d-flex justify-center align-center"
          :class="[
            isCurrentUserMessage ? 'bg-tertiary' : 'bg-tertiary-container',
          ]"
        >
          <v-icon :icon="notFoundIcon" size="32" />
        </div>
        <template v-else>
          <v-message-content-image-file
            v-if="isImage"
            :file-src="fileSrc"
            :is-hovering="isHovering"
          />

          <v-message-content-audio-file
            v-else-if="type === 'Audios'"
            :file-src="fileSrc"
            :is-current-user-message="isCurrentUserMessage"
          />

          <v-message-content-video-file
            v-else-if="type === 'Videos'"
            :file-src="fileSrc"
          />

          <v-message-content-office-file
            v-else
            :isCurrentUserMessage="isCurrentUserMessage"
            :file-name="file.name"
            :file-src="fileSrc"
            :is-hovering="isHovering"
          />
        </template>
      </v-card>
    </template>
  </v-hover>
</template>

<script lang="ts" setup>
import _ from 'lodash';
import { computed, onMounted, ref } from 'vue';

import VMessageContentAudioFile from '@/components/Rooms/Detail/MessageContentFiles/MessageContentAudioFile.vue';
import VMessageContentImageFile from '@/components/Rooms/Detail/MessageContentFiles/MessageContentImageFile.vue';
import VMessageContentOfficeFile from '@/components/Rooms/Detail/MessageContentFiles/MessageContentOfficeFile.vue';
import VMessageContentVideoFile from '@/components/Rooms/Detail/MessageContentFiles/MessageContentVideoFile.vue';
import { useAuth } from '@/composables';
import { IRoomMessageFileResponse } from '@/interfaces';
import { axiosInstacne } from '@/services';

const props = defineProps<{
  type: string;
  file: IRoomMessageFileResponse;
  isCurrentUserMessage: boolean;
}>();

const { getAccessTokenSilently } = useAuth();

const isLoading = ref(true);

const isImage = computed(() =>
  _.some(['Image', 'Images'], (type) => props.type === type),
);
const notFoundIcon = computed(() => {
  switch (props.type) {
    case 'Image':
    case 'Images':
      return 'mdi-image-off-outline';
    case 'Audios':
      return 'mdi-volume-off';
    case 'Videos':
      return 'mdi-video-off';
    default:
      return 'mdi-file-document-outline';
  }
});

const fileType = computed(() => 'file-' + _.lowerCase(props.type));
const fileSrc = ref<string>();

onMounted(async () => {
  if (!props.file.mime || !props.file.pathDisplay) {
    isLoading.value = false;
    return;
  }

  const { pathDisplay } = props.file;

  try {
    const token = await getAccessTokenSilently();

    const { data } = await axiosInstacne.get('/rooms' + pathDisplay, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    fileSrc.value = data;
  } catch {
    fileSrc.value = undefined;
  } finally {
    isLoading.value = false;
  }
});
</script>

<style lang="scss" scoped>
.file-image,
.file-images {
  &:has(.img) {
    width: auto;
  }
}
.file-image {
  height: 8rem;
  width: 10rem;
}

.file-images {
  height: 5rem;
  width: 8rem;
}

.file-audios {
  height: 2.25rem;
  width: 17rem;

  &:has(.audio) {
    height: 2.25rem;
    width: 17rem;
  }
}

.file-videos {
  height: 8.5rem;
  width: 15rem;

  &:has(.video) {
    height: auto;
    width: 15rem;
  }
}

.file-files {
  height: 4.5rem;
  width: 4.5rem;
}
</style>
