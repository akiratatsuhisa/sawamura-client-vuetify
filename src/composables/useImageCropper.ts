import { useFileDialog, useObjectUrl } from '@vueuse/core';
import { ref, shallowRef, watch } from 'vue';
import { Cropper as VCropper } from 'vue-advanced-cropper';

import { FileHelper } from '@/helpers';

import { useThemeModeStorage } from './useAppStorage';

export function useImageCropper() {
  const { isThemeSelectable } = useThemeModeStorage();

  const isThemeModeGenerate = ref<boolean>(false);

  const submitable = ref(false);
  const imageFile = shallowRef<File>();
  const imageCropperSrc = useObjectUrl(imageFile);
  const cropperRef = ref<InstanceType<typeof VCropper>>();

  const {
    files: selectFiles,
    open: openSelectImage,
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

  function resetSelectImage() {
    reset();
    imageFile.value = undefined;
    submitable.value = false;
  }

  async function getImage(
    options: FileHelper.IConvertCanvasToFileOptions & {
      isDynamicDimensions?: boolean;
    },
  ) {
    const result = cropperRef.value!.getResult();
    const image = await FileHelper.convertCanvasToFile(
      result.canvas!,
      !options.isDynamicDimensions
        ? options
        : {
            mimeType: options.mimeType,
            dimensions: FileHelper.resizeImage(
              result.canvas!.width,
              result.canvas!.height,
              options.dimensions?.width ?? 0,
              options.dimensions?.height ?? 0,
            ),
          },
    );
    return image;
  }

  return {
    isThemeSelectable,
    isThemeModeGenerate,
    submitable,
    cropperRef,
    imageCropperSrc,
    openSelectImage,
    resetSelectImage,
    getImage,
  };
}
