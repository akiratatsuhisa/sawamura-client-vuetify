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
          class="h-100 d-flex justify-center align-center"
          :class="[isDark ? 'bg-grey-darken-3' : 'bg-grey-lighten-3']"
        >
          <v-progress-circular
            indeterminate
            color="primary"
          ></v-progress-circular>
        </div>
        <div
          v-else-if="!isLoading && !fileBlob"
          class="h-100 d-flex justify-center align-center"
          :class="[isDark ? 'bg-grey-darken-3' : 'bg-grey-lighten-3']"
        >
          <v-icon
            :icon="
              isImage
                ? 'mdi-image-off-outline'
                : 'mdi-file-document-remove-outline'
            "
            size="32"
          />
        </div>
        <template v-else>
          <a
            hidden
            :href="fileSrc"
            :download="file.name"
            ref="linkDownloadRef"
          ></a>

          <template v-if="isImage">
            <img :src="fileSrc" class="d-block" />

            <v-overlay
              :model-value="isHovering"
              contained
              class="align-center justify-center"
            >
              <v-avatar color="primary">
                <v-icon icon="mdi-image"></v-icon>
              </v-avatar>
            </v-overlay>
          </template>

          <template v-else>
            <div class="h-100 d-flex flex-column flex-nowrap">
              <div class="h-100 d-flex justify-center align-center">
                <v-avatar
                  :color="isDark ? 'grey-darken-3' : 'grey-lighten-3'"
                  size="small"
                >
                  <v-icon icon="mdi-file-document-outline" />
                </v-avatar>
              </div>
              <div class="px-2 pb-2 text-truncate">
                {{ file.name }}
              </div>
            </div>

            <v-overlay
              :model-value="isHovering"
              contained
              class="align-center justify-center"
            >
              <v-avatar color="primary" @click="downloadFile">
                <v-icon icon="mdi-download"></v-icon>
              </v-avatar>
            </v-overlay>
          </template>
        </template>
      </v-card>
    </template>
  </v-hover>
</template>

<script lang="ts" setup>
import { useObjectUrl } from '@vueuse/core';
import _ from 'lodash';
import { computed, inject, onMounted, ref, shallowRef } from 'vue';

import { useAuth } from '@/composables/useAuth';
import { KEYS } from '@/constants';
import { IRoomMessageFileResponse } from '@/interfaces/rooms';
import { axiosInstacne } from '@/services';

const props = defineProps<{
  type: string;
  file: IRoomMessageFileResponse;
}>();

const { getAccessTokenSilently } = useAuth();

const isDark = inject(KEYS.THEMES.IS_DARK)!;

const isLoading = ref(true);
const fileBlob = shallowRef<Blob>();
const fileSrc = useObjectUrl(fileBlob);

const fileType = computed(() => 'file-' + _.lowerCase(props.type));

const isImage = computed(() =>
  _.some(['Image', 'Images'], (type) => props.type === type),
);

onMounted(async () => {
  if (!props.file.mime || !props.file.pathDisplay) {
    isLoading.value = false;
    return;
  }

  const { pathDisplay, mime } = props.file;

  try {
    const token = await getAccessTokenSilently();
    const { data } = await axiosInstacne.get('/rooms' + pathDisplay, {
      responseType: 'arraybuffer',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    fileBlob.value = new Blob([data], { type: mime });
  } catch {
    fileBlob.value = undefined;
  } finally {
    isLoading.value = false;
  }
});

const linkDownloadRef = ref<HTMLLinkElement>();

function downloadFile() {
  linkDownloadRef.value?.click();
}
</script>

<style lang="scss" scoped>
.file-image,
.file-images {
  &:has(img) {
    width: auto;
  }

  img {
    object-fit: cover;
  }
}
.file-image {
  height: 8rem;
  width: 10rem;

  img {
    height: 8rem;
    max-width: 16rem;
  }
}

.file-images {
  height: 5rem;
  width: 8rem;

  img {
    height: 5rem;
    max-width: 12rem;
  }
}

.file-audios {
  height: 4.5rem;
  width: 4.5rem;
}

.file-medias {
  height: 4.5rem;
  width: 4.5rem;
}

.file-files {
  height: 4.5rem;
  width: 4.5rem;
}
</style>
