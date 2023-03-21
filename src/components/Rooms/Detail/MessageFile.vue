<template>
  <v-card
    v-if="isImage"
    class="flex-grow-0 flex-shrink-0"
    elevation="4"
    rounded="lg"
  >
    <div
      v-if="isLoading"
      class="px-8 py-6"
      :class="[isDark ? 'bg-grey-darken-3' : 'bg-grey-lighten-3']"
    >
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>
    <div
      v-else-if="!isLoading && !src"
      class="px-6 py-4"
      :class="[isDark ? 'bg-grey-darken-3' : 'bg-grey-lighten-3']"
    >
      <v-icon icon="mdi-image-off-outline" />
    </div>
    <img
      v-else
      :height="type === 'Image' ? 128 : 80"
      :src="src"
      class="d-block image"
    />
  </v-card>
  <v-card v-else-if="type === 'Files'" class="file" rounded="lg">
    <div
      v-if="isLoading"
      class="px-5 py-5"
      :class="[isDark ? 'bg-grey-darken-3' : 'bg-grey-lighten-3']"
    >
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>
    <div
      v-else-if="!isLoading && !src"
      class="px-5 py-5"
      :class="[isDark ? 'bg-grey-darken-3' : 'bg-grey-lighten-3']"
    >
      <v-icon icon="mdi-file-document-remove-outline" size="2rem" />
    </div>
    <div
      v-else
      class="h-100 d-flex flex-column flex-nowrap"
      @click="downloadFile"
    >
      <div class="pa-1 h-100 w-100 d-flex justify-center align-center">
        <div
          class="pa-1 rounded-circle"
          :class="[isDark ? 'bg-grey-darken-3' : 'bg-grey-lighten-3']"
        >
          <v-icon icon="mdi-file-document-outline" />
        </div>
      </div>
      <v-card-text class="pa-2 text-no-wrap text-truncate">{{
        file.name
      }}</v-card-text>
      <a hidden :href="src" :download="file.name" ref="linkDownloadRef"></a>
    </div>
  </v-card>
</template>

<script lang="ts" setup>
import _ from 'lodash';
import { computed, onMounted, ref } from 'vue';
import { inject } from 'vue';

import { useAuth } from '@/composables/useAuth';
import { KEYS } from '@/constants';
import { IRoomMessageFileResponse } from '@/interfaces/rooms';
import { axiosInstacne } from '@/services';

const { getAccessTokenSilently } = useAuth();

const props = defineProps<{
  type: string;
  file: IRoomMessageFileResponse;
}>();

const isDark = inject(KEYS.THEMES.IS_DARK)!;

const isLoading = ref(true);
const src = ref('');

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

    const blob = new Blob([data], { type: mime });
    src.value = URL.createObjectURL(blob);
  } catch {
    src.value = '';
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
.image {
  object-fit: cover;
  max-width: 256px;
}
</style>

<style lang="scss" scoped>
.file {
  height: 4.5rem;
  width: 4.5rem;
}
</style>
