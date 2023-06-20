<template>
  <v-menu :close-on-content-click="false" width="320px" location="bottom">
    <template v-slot:activator="{ props }">
      <v-btn icon v-bind="props">
        <v-avatar
          color="secondary-container"
          class="elevation-6"
          :image="photoUrl"
        ></v-avatar>
      </v-btn>
    </template>

    <v-list class="bg-surface-variant text-on-surface-variant">
      <v-list-item @click="router.push({ name: 'Profile' })">
        <template #prepend>
          <v-avatar
            color="secondary-container"
            class="elevation-6"
            :image="photoUrl"
          ></v-avatar>
        </template>
        <v-list-item-title v-if="user?.lastName || user?.lastName">
          {{ user?.lastName }} {{ user?.firstName }}
        </v-list-item-title>
        <v-list-item-title v-else>{{ user?.username }}</v-list-item-title>
        <v-list-item-subtitle>{{ user?.username }}</v-list-item-subtitle>

        <template #append>
          <div style="width: 56px"></div>
        </template>
      </v-list-item>

      <v-divider class="my-2"></v-divider>

      <v-list-item>
        <v-list-item-title>
          Theme {{ themes[selectedTheme].name }}
        </v-list-item-title>

        <template #append>
          <v-avatar
            v-for="(value, key) in themes"
            :key="key"
            :color="selectedTheme === key ? 'tertiary' : 'tertiary-container'"
            class="cursor-pointer ml-1"
            @click.stop="selectedTheme = key"
          >
            <v-icon :icon="value.icon"></v-icon>
          </v-avatar>
        </template>
      </v-list-item>

      <v-list-item @click="onLogout">
        <v-list-item-title>Logout</v-list-item-title>

        <template #append>
          <v-avatar color="tertiary-container">
            <v-icon icon="mdi-logout"></v-icon>
          </v-avatar>
        </template>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script lang="ts" setup>
import { useLocalStorage } from '@vueuse/core';
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useTheme } from 'vuetify';

import { useAuth } from '@/composables';

const router = useRouter();

const theme = useTheme();

type ThemeType = 'light' | 'dark' | 'coffee';

const themes = ref<Record<ThemeType, { name: string; icon: string }>>({
  light: { name: 'Light', icon: 'mdi-weather-sunny' },
  dark: { name: 'Dark', icon: 'mdi-weather-night' },
  coffee: { name: 'Coffee', icon: 'mdi-coffee-outline' },
});

const selectedTheme = useLocalStorage<ThemeType>('theme:mode', 'light');

watch(selectedTheme, (selectedTheme) => {
  theme.global.name.value = selectedTheme;
});

const { logout, user, photoUrl } = useAuth();

async function onLogout() {
  await logout();

  router.push({ name: 'Login' });
}
</script>
