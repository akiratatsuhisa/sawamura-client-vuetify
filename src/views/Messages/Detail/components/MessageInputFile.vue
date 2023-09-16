<template>
  <v-hover :key="file.id">
    <template v-slot:default="{ isHovering, props }">
      <v-badge v-bind="props" color="primary" class="cursor-pointer">
        <template #badge>
          <v-icon icon="mdi-close" @click="emit('removeFile', file.id)" />
        </template>

        <v-card
          class="flex-grow-0 flex-shrink-0"
          :class="'file-' + file.type"
          :elevation="isHovering ? 4 : 2"
          rounded="lg"
          v-bind="props"
        >
          <template v-if="isImages">
            <img :src="file.src" class="d-block" />
          </template>

          <template v-else>
            <div
              class="h-100 d-flex flex-column flex-nowrap bg-surface-container-highest"
            >
              <div class="h-100 d-flex justify-center align-center">
                <v-avatar color="secondary" size="large">
                  <v-icon color="on-secondary" :icon="icon" size="large" />
                </v-avatar>
              </div>
              <div class="px-2 pb-2 text-truncate">
                {{ file.file.name }}
              </div>
            </div>
          </template>

          <v-overlay
            :model-value="isHovering && isImages"
            contained
            class="align-center justify-center cursor-pointer"
            @click="selectMessageImageSrc(file.src)"
          >
            <v-avatar color="secondary">
              <v-icon icon="mdi-image"></v-icon>
            </v-avatar>
          </v-overlay>
        </v-card>
      </v-badge>
    </template>
  </v-hover>
</template>

<script lang="ts" setup>
import { computed, inject } from 'vue';

import { KEYS } from '@/constants';
import { BasicFile } from '@/interfaces';

const props = defineProps<{ file: BasicFile }>();
const emit = defineEmits<{ (event: 'removeFile', id: string): void }>();

const isImages = computed(() => props.file.type === 'images');

const icon = computed(() => {
  switch (props.file.type) {
    case 'audios':
      return 'mdi-volume-high';
    case 'videos':
      return 'mdi-video';
    default:
      return 'mdi-file-document-outline';
  }
});

const selectMessageImageSrc = inject(KEYS.CHAT.SELECT_MESSAGE_IMAGE_SRC)!;
</script>

<style lang="scss" scoped>
.files {
  .file-images {
    img {
      height: 6rem;
    }
  }
  .file-audios {
    height: 6rem;
    width: 6rem;
  }

  .file-videos {
    height: 6rem;
    width: 6rem;
  }

  .file-files {
    height: 6rem;
    width: 6rem;
  }
}
</style>
