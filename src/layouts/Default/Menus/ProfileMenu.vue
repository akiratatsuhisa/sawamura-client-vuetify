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
          <v-switch
            color="primary"
            hide-details
            inset
            v-model="isDark"
            label="Theme"
            density="compact"
          >
          </v-switch>
        </v-list-item-title>

        <template #append>
          <v-avatar
            color="tertiary-container"
            class="cursor-pointer"
            @click.stop="isDark = !isDark"
          >
            <v-icon
              :icon="isDark ? 'mdi-weather-night' : 'mdi-weather-sunny'"
            ></v-icon>
          </v-avatar>
        </template>
      </v-list-item>

      <v-list-item @click="onLogout">
        <v-list-item-title> Logout </v-list-item-title>

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
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useTheme } from 'vuetify/lib/framework.mjs';

import { useAuth } from '@/composables/useAuth';

const router = useRouter();

const theme = useTheme();

const isDark = computed<boolean>({
  get() {
    return theme.global.current.value.dark;
  },
  set(value: boolean) {
    theme.global.name.value = value ? 'dark' : 'light';
  },
});

const { logout, user, photoUrl } = useAuth();

async function onLogout() {
  await logout();

  router.push({ name: 'Login' });
}
</script>
