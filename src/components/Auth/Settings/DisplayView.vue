<template>
  <h3 class="text-h5">Theme Mode</h3>
  <span class="text-subtitle-2 font-weight-light text-high-emphasis">
    Manage your display mode. These settings affect all the Sawamura accounts on
    this browser.
  </span>

  <v-radio-group v-model="selectedThemeMode">
    <v-row no-gutters class="ma-0 my-sm-3 mx-sm-6">
      <v-col cols="12" sm="4" v-for="(detail, mode) in themeModes" :key="mode">
        <div
          class="d-flex justify-lg-space-between align-center ma-2 pa-2 rounded-pill elevation-1 cursor-pointer"
          :class="[
            isActiveThemeMode(mode) ? 'bg-tertiary' : 'bg-tertiary-container',
          ]"
          @click.stop.prevent="() => (selectedThemeMode = mode)"
        >
          <v-radio :label="detail.name" :value="mode"></v-radio>
          <v-icon size="30" class="pr-5">{{ detail.icon }}</v-icon>
        </div>
      </v-col>
    </v-row>
  </v-radio-group>
  <v-divider></v-divider>

  <h3 class="text-h5">Personal Theme</h3>
  <span class="text-subtitle-2 font-weight-light text-high-emphasis">
    Manage your color, and background. These settings affect on this account
    only.
  </span>

  <div class="d-flex my-6 flex-column flex-md-row">
    <v-menu :close-on-content-click="false" offset="16">
      <template v-slot:activator="{ props }">
        <v-btn
          :loading="isLoadingTheme"
          v-bind="props"
          color="primary-container"
          prepend-icon="mdi-palette"
        >
          Select Source Color
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
      class="mt-6 mt-md-0"
      @click="clearThemeSource"
    >
      Clear
    </v-btn>
  </div>
</template>

<script lang="ts" setup>
import { useDebounceFn } from '@vueuse/core';
import { watch } from 'vue';

import {
  useAppStorage,
  useAuth,
  useAxios,
  useThemePicker,
} from '@/composables';
import { services } from '@/services';

const { themeModes, selectedThemeMode, isActiveThemeMode } = useAppStorage();

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
