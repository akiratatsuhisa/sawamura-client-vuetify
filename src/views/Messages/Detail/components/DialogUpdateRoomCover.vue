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
        <v-spacer></v-spacer>

        <v-btn v-if="room.coverUrl" color="secondary" @click="onRequestDelete">
          {{ translate('delete') }}
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
        :stencil-component="RectangleStencil"
        :src="imageCropperSrc"
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

import { computed, inject } from 'vue';
import { Cropper as VCropper, RectangleStencil } from 'vue-advanced-cropper';

import VCropperContainer from '@/components/VCropperContainer.vue';
import {
  useAlert,
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

const { translate, makeTranslateAlert } = usePageLocale({
  prefix: 'messages.room.dialogs.changeCover',
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

const { isLoading: isLoadingUpdateCover, request: requestUpdateCover } =
  useAxios(services.rooms, 'updateCover');

const { isLoading: isLoadingDeleteCover, request: requestDeleteCover } =
  useAxios(services.rooms, 'deleteCover');

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

  requestUpdateCover({
    id: room.value!.id,
    image,
    theme: isRoomThemeSelectable.value && isThemeModeGenerate.value,
  });

  emit('update:modelValue', false);
}

const alert = useAlert();

const translateAlert = makeTranslateAlert('delete');

async function onRequestDelete() {
  const { isConfirm } = await alert.fire({
    cancelButton: { show: true, text: translateAlert('cancel') },
    confirmButton: { show: true, text: translateAlert('confirm') },
    message: translateAlert('message'),
  });

  if (!isConfirm) {
    return true;
  }

  requestDeleteCover({ id: room.value!.id });
  emit('update:modelValue', false);
}

function onOpen() {
  resetSelectImage();
}
</script>

<style lang="scss" scoped>
.cropper-wrapper {
  width: 100%;
  height: calc(100dvh - 260px);
}
</style>
