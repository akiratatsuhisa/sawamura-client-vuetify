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
      <v-btn color="primary" @click="open">Choose image</v-btn>

      <v-spacer></v-spacer>
      <v-btn
        v-if="room.coverUrl"
        color="secondary"
        @click="dialogConfirm = true"
      >
        Delete
      </v-btn>
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

  <v-dialog v-model="dialogConfirm" width="auto" persistent>
    <v-card>
      <v-card-text>Do you want to delete room cover?</v-card-text>
      <v-card-actions class="justify-end">
        <v-btn color="primary" @click="dialogConfirm = false">Cancel</v-btn>
        <v-btn color="primary" @click="onSubmitDelete">Agree</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import 'vue-advanced-cropper/dist/style.css';
import 'vue-advanced-cropper/dist/theme.compact.css';

import { useFileDialog, useObjectUrl } from '@vueuse/core';
import { computed, inject, ref, shallowRef, watch } from 'vue';
import { Cropper as VCropper, RectangleStencil } from 'vue-advanced-cropper';

import { useAxios } from '@/composables';
import { KEYS } from '@/constants';
import { FileHelper, IMAGE_FILE } from '@/helpers';
import { services } from '@/services';

defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void;
  (event: 'submit', data: any): void;
}>();

const room = inject(KEYS.CHAT.ROOM)!;

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
  const result = cropperRef.value!.getResult();

  const image = await FileHelper.convertCanvasToFile(result.canvas!, {
    mimeType: IMAGE_FILE.MIME_TYPE,
    dimensions: FileHelper.resizeImage(
      result.canvas!.width,
      result.canvas!.height,
      IMAGE_FILE.PHOTO_DIMENSIONS.WIDTH,
      IMAGE_FILE.PHOTO_DIMENSIONS.HEIGHT,
    ),
  });

  updateCover({ id: room.value!.id, image, theme: theme.value });

  emit('update:modelValue', false);
}

const dialogConfirm = ref(false);

async function onSubmitDelete() {
  deleteCover({ id: room.value!.id });

  dialogConfirm.value = false;
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
