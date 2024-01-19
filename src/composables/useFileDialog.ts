import {
  useFileDialog as useDefault,
  UseFileDialogOptions as IUseDefaultOptions,
} from '@vueuse/core';
import _ from 'lodash';
import { watch } from 'vue';

export interface IUseFileDialogOptions extends IUseDefaultOptions {
  onFileSelected?: (files: FileList | File[] | null) => void;
  onFileCancel?: () => void;
}

export function useOpenFileDialog(options: IUseFileDialogOptions = {}) {
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
