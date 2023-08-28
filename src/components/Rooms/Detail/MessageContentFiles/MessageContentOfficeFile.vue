<template>
  <a hidden :href="fileSrc" :download="fileName" ref="linkDownloadRef"></a>

  <div
    class="h-100 d-flex flex-column flex-nowrap"
    :class="[isCurrentUserMessage ? 'bg-primary' : 'bg-primary-container']"
  >
    <div class="h-100 d-flex justify-center align-center">
      <v-avatar
        :color="isCurrentUserMessage ? 'primary-container' : 'primary'"
        size="small"
      >
        <v-icon
          :color="isCurrentUserMessage ? 'primary' : 'primary-container'"
          icon="mdi-file-document-outline"
        />
      </v-avatar>
    </div>
    <div class="px-2 pb-2 text-truncate">
      {{ fileName }}
    </div>
  </div>

  <v-overlay
    :model-value="isHovering"
    contained
    class="align-center justify-center"
  >
    <v-avatar color="secondary" @click="downloadFile">
      <v-icon icon="mdi-download"></v-icon>
    </v-avatar>
  </v-overlay>
</template>

<script lang="ts" setup>
import _ from 'lodash';
import { ref } from 'vue';

defineProps<{
  isCurrentUserMessage: boolean;
  fileName?: string;
  fileSrc?: string;
  isHovering?: boolean;
}>();

const linkDownloadRef = ref<HTMLLinkElement>();

function downloadFile() {
  linkDownloadRef.value?.click();
}
</script>
