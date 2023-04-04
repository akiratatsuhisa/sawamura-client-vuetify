<template>
  <v-hover :key="file.id">
    <template v-slot:default="{ isHovering, props }">
      <v-badge v-bind="props" color="primary" class="cursor-pointer">
        <template #badge>
          <v-icon icon="mdi-close" @click="emit('remove-file', file.id)" />
        </template>

        <v-card
          class="flex-grow-0 flex-shrink-0"
          :class="'file-' + file.type"
          :elevation="isHovering ? 8 : 4"
          rounded="lg"
          v-bind="props"
        >
          <template v-if="file.type === 'images'">
            <img :src="file.src" class="d-block" />
          </template>

          <template v-else>
            <div class="h-100 d-flex flex-column flex-nowrap">
              <div class="h-100 d-flex justify-center align-center">
                <v-avatar
                  :color="isDark ? 'grey-darken-3' : 'grey-lighten-3'"
                  size="large"
                >
                  <v-icon icon="mdi-file-document-outline" size="large" />
                </v-avatar>
              </div>
              <div class="px-2 pb-2 text-truncate">
                {{ file.file.name }}
              </div>
            </div>
          </template>
        </v-card>
      </v-badge>
    </template>
  </v-hover>
</template>

<script lang="ts" setup>
import { inject } from 'vue';

import { KEYS } from '@/constants';
import { BasicFile } from '@/interfaces/rooms';

defineProps<{ file: BasicFile }>();
const emit = defineEmits<{ (event: 'removeFile', id: string): void }>();

const isDark = inject(KEYS.THEMES.IS_DARK)!;
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

  .file-medias {
    height: 6rem;
    width: 6rem;
  }

  .file-files {
    height: 6rem;
    width: 6rem;
  }
}
</style>
