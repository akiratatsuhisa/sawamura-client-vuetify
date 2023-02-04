<template>
  <v-app-bar elevation="4">
    <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

    <v-spacer></v-spacer>

    <v-menu :close-on-content-click="false">
      <template v-slot:activator="{ props }">
        <v-btn icon="mdi-account-circle" v-bind="props"></v-btn>
      </template>

      <v-list>
        <v-list-item
          prepend-avatar="https://randomuser.me/api/portraits/men/85.jpg"
          @click="router.push({ name: 'Profile' })"
        >
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

        <v-list-item @click="isDark = !isDark">
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
            <v-avatar :color="isDark ? 'grey-darken-3' : 'grey-lighten-3'">
              <v-icon
                :icon="isDark ? 'mdi-weather-night' : 'mdi-weather-sunny'"
              ></v-icon>
            </v-avatar>
          </template>
        </v-list-item>

        <v-list-item @click="onLogout">
          <v-list-item-title> Logout </v-list-item-title>

          <template #append>
            <v-avatar :color="isDark ? 'grey-darken-3' : 'grey-lighten-3'">
              <v-icon icon="mdi-logout"></v-icon>
            </v-avatar>
          </template>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script lang="ts" setup>
import { computed, inject } from "vue";
import { useRouter } from "vue-router";
import { useTheme } from "vuetify";

import { useAuth } from "@/composables/useAuth";
import { KEYS } from "@/constants";

const drawer = inject(KEYS.DRAWER.SHOW);

const router = useRouter();

const { logout, user } = useAuth();

const theme = useTheme();

const isDark = computed<boolean>({
  get() {
    return theme.global.current.value.dark;
  },
  set(value: boolean) {
    theme.global.name.value = value ? "dark" : "light";
  },
});

async function onLogout() {
  await logout();

  router.push({ name: "Login" });
}
</script>
