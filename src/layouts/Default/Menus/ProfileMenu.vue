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
        <v-list-item-title v-if="fullName">
          {{ fullName }}
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
          Theme {{ selectedThemeModeDetail.name }}
        </v-list-item-title>

        <template #append>
          <v-avatar
            v-for="(detail, mode) in themeModes"
            :key="mode"
            :color="isActiveThemeMode(mode) ? 'tertiary' : 'tertiary-container'"
            class="cursor-pointer ml-1"
            @click.stop="selectedThemeMode = mode"
          >
            <v-icon :icon="detail.icon"></v-icon>
          </v-avatar>
        </template>
      </v-list-item>

      <v-list-item :to="{ name: 'Settings' }">
        <v-list-item-title>Settings</v-list-item-title>

        <template #append>
          <v-avatar color="tertiary-container">
            <v-icon icon="mdi-cog"></v-icon>
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
import { useRouter } from 'vue-router';

import { useAuth, useThemeModeStorage } from '@/composables';

const router = useRouter();

const {
  themeModes,
  selectedThemeMode,
  selectedThemeModeDetail,
  isActiveThemeMode,
} = useThemeModeStorage();

const { logout, user, fullName, photoUrl } = useAuth();

async function onLogout() {
  await logout();

  router.push({ name: 'Login' });
}
</script>
