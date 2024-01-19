<template>
  <h3 class="text-h5">{{ translateStyleMode('title') }}</h3>
  <span class="text-subtitle-2 font-weight-light text-high-emphasis">
    {{ translateStyleMode('subtitle') }}
  </span>

  <v-radio-group v-model="selectedThemeStyle" hide-details>
    <div
      class="d-grid ga-3 ma-0 mt-3 mx-md-6"
      :style="{
        'grid-template-columns': `repeat(${
          $vuetify.display.smAndDown ? '1' : '3'
        }, 1fr)`,
      }"
    >
      <div
        v-for="(detail, style) in themeStyles"
        :key="style"
        class="d-flex justify-space-between align-center pa-2 rounded-pill elevation-1 cursor-pointer"
        :class="[
          isActiveThemeStyle(style) ? 'bg-tertiary' : 'bg-tertiary-container',
        ]"
        @click.stop.prevent="() => (selectedThemeStyle = style)"
      >
        <v-radio :label="$t(`common.styles.${detail.name}`)" :value="style" />
      </div>
    </div>
  </v-radio-group>

  <v-divider class="my-3" />

  <h3 class="text-h5">{{ translateThemeMode('title') }}</h3>
  <span class="text-subtitle-2 font-weight-light text-high-emphasis">
    {{ translateThemeMode('subtitle') }}
  </span>

  <v-radio-group v-model="selectedThemeMode" hide-details>
    <div
      class="d-grid ga-3 ma-0 mt-3 mx-md-6"
      :style="{
        'grid-template-columns': `repeat(${
          $vuetify.display.smAndDown ? '1' : '3'
        }, 1fr)`,
      }"
    >
      <div
        v-for="(detail, mode) in themeModes"
        :key="mode"
        class="d-flex justify-space-between align-center pa-2 rounded-pill elevation-1 cursor-pointer"
        :class="[
          isActiveThemeMode(mode) ? 'bg-tertiary' : 'bg-tertiary-container',
        ]"
        @click.stop.prevent="() => (selectedThemeMode = mode)"
      >
        <v-radio :label="$t(`common.themes.${detail.name}`)" :value="mode" />
        <v-icon size="30" class="pr-5">{{ detail.icon }}</v-icon>
      </div>
    </div>
  </v-radio-group>

  <v-expand-transition>
    <div v-if="isAuthThemeSelectable">
      <v-divider class="my-3" />

      <h3 class="text-h5">{{ translatePersonalTheme('title') }}</h3>
      <span class="text-subtitle-2 font-weight-light text-high-emphasis">
        {{ translatePersonalTheme('subtitle') }}
      </span>

      <div class="d-flex flex-column flex-sm-row mt-3">
        <v-menu :close-on-content-click="false" offset="16">
          <template #activator="{ props }">
            <v-btn
              :loading="isLoadingTheme"
              v-bind="props"
              color="primary-container"
              variant="flat"
              prepend-icon="mdi-palette"
            >
              {{ translateThemeFormField('select') }}
              <template #append>
                <v-avatar
                  v-if="themeSource"
                  :color="displayThemeColor"
                  size="x-small"
                  class="elevation-4"
                ></v-avatar>
              </template>
            </v-btn>
          </template>

          <v-color-picker
            v-model="themePicker"
            class="overflow-hidden"
            mode="rgb"
            hide-inputs
          />
        </v-menu>

        <v-spacer />

        <v-btn
          :loading="isLoadingTheme"
          color="primary"
          variant="tonal"
          class="mt-6 mt-sm-0"
          @click="clearThemeSource"
        >
          {{ translateThemeFormField('clear') }}
        </v-btn>
      </div>
    </div>
  </v-expand-transition>
</template>

<script lang="ts" setup>
import { useDebounceFn } from '@vueuse/core';
import { watch } from 'vue';

import {
  useAuth,
  useAxios,
  useIsAuthThemeSelectable,
  usePageLocale,
  useThemeModeStorage,
  useThemePicker,
  useThemeStyleStorage,
} from '@/composables';
import { services } from '@/services';

const { translate: translateStyleMode } = usePageLocale({
  prefix: 'settings.display.themeStyle',
});
const { translate: translateThemeMode } = usePageLocale({
  prefix: 'settings.display.themeMode',
});
const {
  translate: translatePersonalTheme,
  translateFormField: translateThemeFormField,
} = usePageLocale({
  prefix: 'settings.display.personalTheme',
});

const { themeStyles, selectedThemeStyle, isActiveThemeStyle } =
  useThemeStyleStorage();
const { themeModes, selectedThemeMode, isActiveThemeMode } =
  useThemeModeStorage();
const isAuthThemeSelectable = useIsAuthThemeSelectable();

const { fetchAccessToken, user } = useAuth();

const { themeSource, themePicker, displayThemeColor, clearThemeSource } =
  useThemePicker();
themeSource.value = user.value?.themeSource ?? null;

const { isLoading: isLoadingTheme, request: requestUpdateTheme } = useAxios(
  services.auth,
  'updateTheme',
);

const onThemeSourceChangeDebounce = useDebounceFn(async (source) => {
  await requestUpdateTheme({ source });
  await fetchAccessToken();
}, 500);

watch(themeSource, (themeSource) => {
  onThemeSourceChangeDebounce(themeSource);
});
</script>
