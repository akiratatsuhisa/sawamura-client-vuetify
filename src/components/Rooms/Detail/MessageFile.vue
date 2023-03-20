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
      <v-icon icon="mdi-image-off-outline" size="48" />
    </div>
    <img
      v-else
      :height="type === 'Image' ? 128 : 80"
      :src="src"
      class="d-block image"
    />
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
</script>

<style lang="scss" scoped>
.image {
  object-fit: cover;
  max-width: 256px;
}
</style>
