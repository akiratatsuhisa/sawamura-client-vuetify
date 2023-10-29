import { MaybeRef, useStyleTag } from '@vueuse/core';
import { computed, inject, provide, ref, unref, watch } from 'vue';

import { useAuth, useThemeStyleStorage } from '@/composables';
import { KEYS } from '@/constants';

export function initThemeStyle() {
  const { user } = useAuth();
  const { selectedThemeStyle } = useThemeStyleStorage();

  const style = ref<string>();
  provide(KEYS.THEME_STYLE, style);

  useStyleTag(
    computed(() => {
      switch (selectedThemeStyle.value) {
        case 'default':
          return style.value ?? '';
        case 'mixed':
          return style.value ?? user.value?.themeStyle ?? '';
        case 'override':
          return user.value?.themeStyle ?? '';
        case 'none':
        default:
          return '';
      }
    }),
    { id: 'vuetify-style' },
  );
}

export function useThemeStyle(themeStyle: MaybeRef<string | null | undefined>) {
  const style = inject(KEYS.THEME_STYLE)!;

  watch(
    () => unref(themeStyle),
    (themeStyle, _prev, onCleanup) => {
      if (themeStyle) {
        style.value = themeStyle;
      } else {
        style.value = undefined;
      }

      onCleanup(() => {
        style.value = undefined;
      });
    },
    { immediate: true },
  );
}
