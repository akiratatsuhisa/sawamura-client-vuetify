<template>
  <v-base-dialog
    mobile-width="700"
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    :disabled-submit="isLoading || !submitable"
    @submit="onSubmit"
    @open="onOpen"
  >
    <template #title>Room Cover</template>

    <div class="d-flex mb-3">
      <v-btn color="primary" @click="openSelectImage">Choose image</v-btn>

      <v-spacer></v-spacer>

      <v-btn v-if="room.coverUrl" color="secondary" @click="onRequestDelete">
        Delete
      </v-btn>
    </div>

    <v-switch
      v-if="isThemeModeSelectable"
      v-model="isThemeModeGenerate"
      density="compact"
      color="tertiary"
      label="Generate theme from uploaded image"
      inset
      hide-details
    ></v-switch>

    <v-divider class="my-3"></v-divider>

    <div class="d-flex justify-center align-center">
      <div
        class="d-flex justify-center align-center cropper-wrapper"
        :style="{
          height: $vuetify.display.smAndDown ? '' : '400px',
        }"
      >
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
          @ready="submitable = true"
          @error="submitable = false"
        />
      </div>
    </div>

    <template #action>Change</template>
  </v-base-dialog>
</template>

<script lang="ts" setup>
import 'vue-advanced-cropper/dist/style.css';
import 'vue-advanced-cropper/dist/theme.compact.css';

import { computed, inject } from 'vue';
import { Cropper as VCropper, RectangleStencil } from 'vue-advanced-cropper';

import { useAlert, useAxios, useImageCropper } from '@/composables';
import { KEYS } from '@/constants';
import { IMAGE_FILE } from '@/helpers';
import { services } from '@/services';

defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void;
  (event: 'submit', data: any): void;
}>();

const room = inject(KEYS.CHAT.ROOM)!;

const {
  isThemeModeSelectable,
  isThemeModeGenerate,
  submitable,
  cropperRef,
  imageCropperSrc,
  openSelectImage,
  resetSelectImage,
  getImage,
} = useImageCropper();

const { isLoading: isLoadingUpdateCover, excute: updateCover } = useAxios(
  services.rooms,
  'updateCover',
);

const { isLoading: isLoadingDeleteCover, excute: deleteCover } = useAxios(
  services.rooms,
  'deleteCover',
);

const isLoading = computed(
  () => isLoadingUpdateCover.value || isLoadingDeleteCover.value,
);

async function onSubmit() {
  const image = await getImage({
    mimeType: IMAGE_FILE.MIME_TYPE,
    isDynamicDimensions: true,
    dimensions: {
      width: IMAGE_FILE.PHOTO_DIMENSIONS.WIDTH,
      height: IMAGE_FILE.PHOTO_DIMENSIONS.HEIGHT,
    },
  });

  updateCover({
    id: room.value!.id,
    image,
    theme: isThemeModeSelectable.value && isThemeModeGenerate.value,
  });

  emit('update:modelValue', false);
}

const alert = useAlert();

async function onRequestDelete() {
  const { isCancel } = await alert.fire({
    cancelButton: { show: true, text: 'Cancel' },
    confirmButton: { show: true, text: 'Agree' },
    message: 'Do you want to delete room cover?',
  });

  if (isCancel) {
    return true;
  }

  deleteCover({ id: room.value!.id });
  emit('update:modelValue', false);
}

function onOpen() {
  resetSelectImage();
}
</script>

<style lang="scss" scoped>
.cropper-wrapper {
  width: 100%;
  height: calc(100vh - 270px);
}
</style>
