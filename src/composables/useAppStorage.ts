import { createSharedComposable, useLocalStorage } from '@vueuse/core';
import { computed, reactive, watch } from 'vue';
import { useTheme } from 'vuetify';

export type ThemeModeType = 'light' | 'dark' | 'coffee';

export const useAppStorage = createSharedComposable(() => {
  const theme = useTheme();

  const themeModes = reactive<
    Record<ThemeModeType, { name: string; icon: string }>
  >({
    light: { name: 'Light', icon: 'mdi-weather-sunny' },
    dark: { name: 'Dark', icon: 'mdi-weather-night' },
    coffee: { name: 'Coffee', icon: 'mdi-coffee-outline' },
  });

  const selectedThemeMode = useLocalStorage<ThemeModeType>(
    'theme:mode',
    'light',
  );

  const selectedThemeModeDetail = computed(
    () => themeModes[selectedThemeMode.value],
  );

  watch(selectedThemeMode, (selectedTheme) => {
    theme.global.name.value = selectedTheme;
  });

  function isActiveThemeMode(mode: ThemeModeType) {
    return selectedThemeMode.value === mode;
  }

  return {
    themeModes,
    selectedThemeMode,
    selectedThemeModeDetail,
    isActiveThemeMode,
  };
});
