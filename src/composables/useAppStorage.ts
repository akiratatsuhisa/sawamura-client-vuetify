import { createSharedComposable, useLocalStorage } from '@vueuse/core';
import { computed, reactive, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useTheme } from 'vuetify';

export type ThemeStyleType = 'default' | 'mixed' | 'override' | 'none';

export const useThemeStyleStorage = createSharedComposable(() => {
  const themeStyles = reactive<Record<ThemeStyleType, { name: string }>>({
    default: { name: 'default' },
    mixed: { name: 'mixed' },
    override: { name: 'override' },
    none: { name: 'none' },
  });

  const selectedThemeStyle = useLocalStorage<ThemeStyleType>(
    'theme:style',
    'default',
  );

  const selectedThemeStyleDetail = computed(
    () => themeStyles[selectedThemeStyle.value],
  );

  function isActiveThemeStyle(style: ThemeStyleType) {
    return selectedThemeStyle.value === style;
  }

  return {
    themeStyles,
    selectedThemeStyle,
    selectedThemeStyleDetail,
    isActiveThemeStyle,
  };
});

export type ThemeModeType = 'light' | 'dark' | 'coffee';

export const useThemeModeStorage = createSharedComposable(() => {
  const theme = useTheme();

  const themeModes = reactive<
    Record<ThemeModeType, { name: string; icon: string }>
  >({
    light: { name: 'light', icon: 'mdi-weather-sunny' },
    dark: { name: 'dark', icon: 'mdi-weather-night' },
    coffee: { name: 'coffee', icon: 'mdi-coffee-outline' },
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

export type LanguageType = 'en' | 'ja';

export const useLanguageStorage = createSharedComposable(() => {
  const { locale } = useI18n();

  const selectedLanguage = computed<LanguageType>({
    get: () => locale.value as LanguageType,
    set: (value: LanguageType) => {
      locale.value = value;
      localStorage.setItem('locale:language', value);
    },
  });

  const languages = reactive<
    Record<LanguageType, { name: string; image: string }>
  >({
    en: { name: 'en', image: '/countries/united-states.png' },
    ja: { name: 'ja', image: '/countries/japan.png' },
  });

  const selectedLanguageDetail = computed(
    () => languages[selectedLanguage.value],
  );

  function isActiveLanguage(language: LanguageType) {
    return selectedLanguage.value === language;
  }

  return {
    languages,
    selectedLanguage,
    selectedLanguageDetail,
    isActiveLanguage,
  };
});
