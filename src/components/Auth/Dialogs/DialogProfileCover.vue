<template>
  <v-base-dialog
    fullscreen
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    :disabled-submit="isLoading || !submitable"
    @submit="onSubmit"
    @open="onOpen"
  >
    <template #title>Profile Photo</template>

    <div class="d-flex mb-3">
      <v-btn color="primary" @click="open">Choose image</v-btn>
    </div>

    <div>
      <v-switch
        v-model="theme"
        density="compact"
        color="tertiary"
        label="Generate theme from uploaded image"
        inset
        hide-details
      ></v-switch>
    </div>

    <v-divider class="my-3"></v-divider>

    <div class="d-flex justify-center align-center cropper-wrapper">
      <div
        :style="{ backgroundImage: 'url(' + imageCropperSrc + ')' }"
        class="image-background"
      ></div>
      <v-cropper
        ref="cropperRef"
        class="cropper elevation-1"
        background-class="cropper-background"
        :stencil-component="RectangleStencil"
        :src="imageCropperSrc"
        :stencil-props="{
          aspectRatio: 16 / 9,
          width: IMAGE_FILE.COVER_DIMENSIONS.WIDTH,
          height: IMAGE_FILE.COVER_DIMENSIONS.HEIGHT,
        }"
        @ready="submitable = true"
        @error="submitable = false"
      />
    </div>

    <template #action>Change</template>
  </v-base-dialog>
</template>

<script lang="ts" setup>
import 'vue-advanced-cropper/dist/style.css';
import 'vue-advanced-cropper/dist/theme.compact.css';

import { useFileDialog, useObjectUrl } from '@vueuse/core';
import { ref, shallowRef, watch } from 'vue';
import { Cropper as VCropper, RectangleStencil } from 'vue-advanced-cropper';

import { useAuth } from '@/composables/useAuth';
import { useAxios } from '@/composables/useAxios';
import { FileHelper, IMAGE_FILE } from '@/helpers/file';
import { services } from '@/services';

defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void;
  (event: 'submit', data: any): void;
}>();

const { fetchAccessToken, updateImage } = useAuth();

const submitable = ref(false);

const theme = ref<boolean>(false);
const imageFile = shallowRef<File>();
const imageCropperSrc = useObjectUrl(imageFile);

const {
  files: selectFiles,
  open,
  reset,
} = useFileDialog({
  multiple: false,
  accept: '.jpg,.png',
});

watch(selectFiles, (files) => {
  const file = files?.item(0);
  if (!file) {
    return;
  }

  imageFile.value = file;
});

const cropperRef = ref<InstanceType<typeof VCropper>>();

const { isLoading, excute: updateCover } = useAxios(
  services.auth,
  'updateCover',
);

async function onSubmit() {
  const result = cropperRef.value!.getResult();

  const image = await FileHelper.convertCanvasToFile(result.canvas!, {
    mimeType: IMAGE_FILE.MIME_TYPE,
    dimensions: {
      width: IMAGE_FILE.COVER_DIMENSIONS.WIDTH,
      height: IMAGE_FILE.COVER_DIMENSIONS.HEIGHT,
    },
  });

  (async () => {
    await updateCover({ image, theme: theme.value });
    await fetchAccessToken();
    updateImage('cover');
  })();

  emit('update:modelValue', false);
}

function onOpen() {
  reset();
  imageFile.value = undefined;
  submitable.value = false;
}
</script>

<style lang="scss" scoped>
.cropper-wrapper {
  width: 100%;
  height: calc(100vh - 270px);
}
</style>
