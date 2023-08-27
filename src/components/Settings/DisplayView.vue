<template>
  <h3 class="text-h5">{{ translateThemeMode('title') }}</h3>
  <span class="text-subtitle-2 font-weight-light text-high-emphasis">
    {{ translateThemeMode('subtitle') }}
  </span>

  <v-radio-group v-model="selectedThemeMode" hide-details>
    <v-row no-gutters class="ma-0 mt-3 mx-md-6">
      <v-col
        cols="12"
        sm="4"
        v-for="(detail, mode, index) in themeModes"
        :key="mode"
      >
        <div
          class="d-flex justify-space-between align-center pa-2 rounded-pill elevation-1 cursor-pointer"
          :class="[
            isActiveThemeMode(mode) ? 'bg-tertiary' : 'bg-tertiary-container',
            index !== 0 ? 'ml-0 ml-sm-3' : 'ml-0',
            index !== 0 ? 'mt-3 mt-sm-0' : 'mt-sm-0',
          ]"
          @click.stop.prevent="() => (selectedThemeMode = mode)"
        >
          <v-radio
            :label="$t(`common.themes.${detail.name}`)"
            :value="mode"
          ></v-radio>
          <v-icon size="30" class="pr-5">{{ detail.icon }}</v-icon>
        </div>
      </v-col>
    </v-row>
  </v-radio-group>

  <v-expand-transition>
    <div v-if="isThemeSelectable">
      <v-divider class="my-3" />

      <h3 class="text-h5">{{ translatePersonalTheme('title') }}</h3>
      <span class="text-subtitle-2 font-weight-light text-high-emphasis">
        {{ translatePersonalTheme('subtitle') }}
      </span>

      <div class="d-flex flex-column flex-sm-row mt-3">
        <v-menu :close-on-content-click="false" offset="16">
          <template v-slot:activator="{ props }">
            <v-btn
              :loading="isLoadingTheme"
              v-bind="props"
              color="primary-container"
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
          ></v-color-picker>
        </v-menu>

        <v-spacer></v-spacer>

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
  usePageLocale,
  useThemeModeStorage,
  useThemePicker,
} from '@/composables';
import { services } from '@/services';

const { translate: translateThemeMode } = usePageLocale({
  prefix: 'settings.display.themeMode',
});
const {
  translate: translatePersonalTheme,
  translateFormField: translateThemeFormField,
} = usePageLocale({
  prefix: 'settings.display.personalTheme',
});

const { themeModes, selectedThemeMode, isThemeSelectable, isActiveThemeMode } =
  useThemeModeStorage();

const { fetchAccessToken, user } = useAuth();

const { themeSource, themePicker, displayThemeColor, clearThemeSource } =
  useThemePicker();
themeSource.value = user.value?.themeSource ?? null;

const { isLoading: isLoadingTheme, excute: updateTheme } = useAxios(
  services.auth,
  'updateTheme',
);

const onThemeSourceChangeDebounce = useDebounceFn(async (source) => {
  await updateTheme({ source });
  await fetchAccessToken();
}, 500);

watch(themeSource, (themeSource) => {
  onThemeSourceChangeDebounce(themeSource);
});
</script>
