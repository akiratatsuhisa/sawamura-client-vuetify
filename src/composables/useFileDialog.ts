import {
  useFileDialog as useDefault,
  UseFileDialogOptions as UseDefaultOptions,
} from '@vueuse/core';
import _ from 'lodash';
import { watch } from 'vue';

export interface UseFileDialogOptions extends UseDefaultOptions {
  onFileSelected?: (files: FileList | File[] | null) => void;
  onFileCancel?: () => void;
}

export function useOpenFileDialog(options: UseFileDialogOptions = {}) {
  const { onFileSelected, onFileCancel } = options;

  const { files, open, reset } = useDefault({
    ..._.omit(options, ['onFileSelected', 'onFileCancel']),
  });

  watch(files, (files) => {
    if (!files?.length) {
      onFileCancel?.();
      return;
    }

    onFileSelected?.(files);
    reset();
  });

  return open;
}
