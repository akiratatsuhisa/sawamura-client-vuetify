<template>
  <v-base-dialog
    fullscreen
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    :disabled-submit="isLoading || !submitable"
    @submit="onSubmit"
    @open="onOpen"
  >
    <template #title>{{ translateShared('dialogProfileCoverTitle') }}</template>

    <div class="mb-3">
      <div class="d-flex mb-3">
        <v-btn color="primary" variant="flat" @click="openSelectImage">
          {{ $t('common.theme.chooseImage') }}
        </v-btn>
      </div>

      <v-switch
        v-if="isAuthThemeSelectable"
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
      :background-src="imageCropperSrc"
    >
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
    </v-cropper-container>

    <template #action>{{ $t('common.data.change') }}</template>
  </v-base-dialog>
</template>

<script lang="ts" setup>
import 'vue-advanced-cropper/dist/style.css';
import 'vue-advanced-cropper/dist/theme.compact.css';

import { Cropper as VCropper, RectangleStencil } from 'vue-advanced-cropper';

import VCropperContainer from '@/components/VCropperContainer.vue';
import {
  useAuth,
  useAxios,
  useImageCropper,
  useIsAuthThemeSelectable,
  usePageLocale,
} from '@/composables';
import { IMAGE_FILE } from '@/helpers';
import { services } from '@/services';

defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void;
}>();

const { translateShared } = usePageLocale({ prefix: 'users.profile' });
const { fetchAccessToken } = useAuth();

const isAuthThemeSelectable = useIsAuthThemeSelectable();
const {
  isThemeModeGenerate,
  submitable,
  cropperRef,
  imageCropperSrc,
  openSelectImage,
  resetSelectImage,
  getImage,
} = useImageCropper();
const { isLoading, excute: updateCover } = useAxios(
  services.auth,
  'updateCover',
);

async function onSubmit() {
  const image = await getImage({
    mimeType: IMAGE_FILE.MIME_TYPE,
    dimensions: {
      width: IMAGE_FILE.COVER_DIMENSIONS.WIDTH,
      height: IMAGE_FILE.COVER_DIMENSIONS.HEIGHT,
    },
  });

  (async () => {
    await updateCover({
      image,
      theme: isAuthThemeSelectable.value && isThemeModeGenerate.value,
    });
    await fetchAccessToken();
  })();

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
