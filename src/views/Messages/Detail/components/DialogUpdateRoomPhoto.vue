<template>
  <v-base-dialog
    desktop-width="700"
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    :disabled-submit="isLoading || !submitable"
    @submit="onSubmit"
    @open="onOpen"
  >
    <template #title>{{ translate('title') }}</template>

    <div class="mb-3">
      <div class="d-flex mb-3">
        <v-btn color="primary" variant="flat" @click="openSelectImage">
          {{ $t('common.theme.chooseImage') }}
        </v-btn>
      </div>

      <v-switch
        v-if="isRoomThemeSelectable"
        v-model="isThemeModeGenerate"
        density="compact"
        color="tertiary"
        true-icon="mdi-check"
        false-icon="mdi-close"
        :label="$t('common.theme.generateTheme')"
        inset
        hide-details
      />
      <div v-else style="height: 40px"></div>
    </div>

    <v-cropper-container
      class="cropper-wrapper"
      height="400px"
      :background-src="imageCropperSrc"
    >
      <v-cropper
        ref="cropperRef"
        class="cropper elevation-1"
        background-class="cropper-background"
        :stencil-component="CircleStencil"
        :src="imageCropperSrc"
        :stencil-props="{
          aspectRatio: 1 / 1,
          width: IMAGE_FILE.PHOTO_DIMENSIONS.WIDTH,
          height: IMAGE_FILE.PHOTO_DIMENSIONS.HEIGHT,
        }"
        @ready="submitable = true"
        @error="submitable = false"
      />
    </v-cropper-container>

    <template #action>{{ translate('form.submit') }}</template>
  </v-base-dialog>
</template>

<script lang="ts" setup>
import 'vue-advanced-cropper/dist/style.css';
import 'vue-advanced-cropper/dist/theme.compact.css';

import { inject } from 'vue';
import { CircleStencil, Cropper as VCropper } from 'vue-advanced-cropper';

import VCropperContainer from '@/components/VCropperContainer.vue';
import {
  useAxios,
  useImageCropper,
  useIsRoomThemeSelectable,
  usePageLocale,
} from '@/composables';
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

const { translate } = usePageLocale({
  prefix: 'messages.room.dialogs.changePhoto',
});

const room = inject(KEYS.CHAT.ROOM)!;

const isRoomThemeSelectable = useIsRoomThemeSelectable();
const {
  isThemeModeGenerate,
  submitable,
  cropperRef,
  imageCropperSrc,
  openSelectImage,
  resetSelectImage,
  getImage,
} = useImageCropper();

const { isLoading, excute: updatePhoto } = useAxios(
  services.rooms,
  'updatePhoto',
);

async function onSubmit() {
  const image = await getImage({
    mimeType: IMAGE_FILE.MIME_TYPE,
    dimensions: {
      width: IMAGE_FILE.PHOTO_DIMENSIONS.WIDTH,
      height: IMAGE_FILE.PHOTO_DIMENSIONS.HEIGHT,
    },
  });

  updatePhoto({
    id: room.value!.id,
    image,
    theme: isRoomThemeSelectable.value && isThemeModeGenerate.value,
  });

  emit('update:modelValue', false);
}

function onOpen() {
  resetSelectImage();
}
</script>

<style lang="scss" scoped>
.cropper-wrapper {
  width: 100%;
  height: calc(100vh - 260px);
}
</style>
