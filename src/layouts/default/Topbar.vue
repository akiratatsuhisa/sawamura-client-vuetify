<template>
  <v-app-bar elevation="4">
    <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

    <v-spacer></v-spacer>

    <v-btn
      :append-icon="
        theme.current.value.dark ? 'mdi-weather-night' : 'mdi-weather-sunny'
      "
      @click="toggleTheme"
      >Theme</v-btn
    >
  </v-app-bar>
</template>

<script lang="ts" setup>
import { inject } from "vue";
import { useTheme } from "vuetify";

import { KEYS } from "@/constants";

const drawer = inject(KEYS.DRAWER.SHOW);

const theme = useTheme();
const toggleTheme = () =>
  (theme.global.name.value = theme.global.current.value.dark
    ? "light"
    : "dark");
</script>
