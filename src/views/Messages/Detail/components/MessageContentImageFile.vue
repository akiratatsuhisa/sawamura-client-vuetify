<template>
  <img :src="fileSrc" class="img d-block" />

  <v-overlay
    :model-value="isHovering"
    contained
    class="align-center justify-center cursor-pointer"
    @click="selectMessageImageSrc(fileSrc!)"
  >
    <v-avatar color="secondary">
      <v-icon icon="mdi-image" />
    </v-avatar>
  </v-overlay>
</template>

<script lang="ts" setup>
import _ from 'lodash';
import { inject } from 'vue';

import { KEYS } from '@/constants';

defineProps<{
  fileSrc?: string;
  isHovering?: boolean;
}>();

const selectMessageImageSrc = inject(KEYS.CHAT.SELECT_MESSAGE_IMAGE_SRC)!;
</script>

<style lang="scss" scoped>
.file-image,
.file-images {
  .img {
    object-fit: cover;
  }
}
.file-image {
  .img {
    height: 8rem;
    max-width: 16rem;
  }
}

.file-images {
  .img {
    height: 5rem;
    max-width: 12rem;
  }
}
</style>
