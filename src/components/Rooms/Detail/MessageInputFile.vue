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
          :elevation="isHovering ? 8 : 4"
          rounded="lg"
          v-bind="props"
        >
          <template v-if="file.type === 'images'">
            <img :src="file.src" class="d-block" />
          </template>

          <template v-else>
            <div class="h-100 d-flex flex-column flex-nowrap bg-surface">
              <div class="h-100 d-flex justify-center align-center">
                <v-avatar color="secondary-container" size="large">
                  <v-icon
                    color="on-secondary-container"
                    icon="mdi-file-document-outline"
                    size="large"
                  />
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
import { BasicFile } from '@/interfaces';

defineProps<{ file: BasicFile }>();
const emit = defineEmits<{ (event: 'removeFile', id: string): void }>();
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
