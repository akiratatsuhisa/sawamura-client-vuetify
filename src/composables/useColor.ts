import { MaybeRef } from '@vueuse/core';
import { computed, ref, unref } from 'vue';

import { numberToRgb, rgbToNumber } from '@/helpers';

export function useDisplayThemeColor(source: MaybeRef<number | null>) {
  return computed<string>(() => {
    const value = unref(source);
    if (!value) {
      return '';
    }

    const { r, g, b } = numberToRgb(value);

    return `rgba(${r}, ${g}, ${b}, 1)`;
  });
}

export function useThemePicker() {
  const themeSource = ref<number | null>(null);

  const themePicker = computed({
    get() {
      const value = unref(themeSource);

      if (!value) {
        return null;
      }

      return numberToRgb(value);
    },
    set(value: { r: number; g: number; b: number } | null) {
      if (!value) {
        themeSource.value = null;
        return;
      }

      themeSource.value = rgbToNumber(value);
    },
  });

  function clearThemeSource() {
    themeSource.value = null;
  }

  const displayThemeColor = useDisplayThemeColor(themeSource);

  return { themeSource, themePicker, displayThemeColor, clearThemeSource };
}
