<template>
  <v-app>
    <topbar></topbar>

    <sidebar></sidebar>

    <router-view />
  </v-app>
</template>

<script lang="ts" setup>
import { provide, ref } from "vue";

import { initSocketChat } from "@/composables/useChat";
import { KEYS } from "@/constants";

import Sidebar from "./Sidebar.vue";
import Topbar from "./Topbar.vue";

const drawer = ref<boolean | null>(null);
provide(KEYS.DRAWER, drawer);

initSocketChat();
</script>
