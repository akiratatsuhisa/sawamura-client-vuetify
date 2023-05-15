<template>
  <router-view></router-view>

  <v-snackbars-container />
</template>

<script setup lang="ts">
import { computed, provide } from 'vue';
import { useTheme } from 'vuetify';

import VSnackbarsContainer from '@/components/VSnackbarsContainer.vue';

import { KEYS } from './constants';

const theme = useTheme();

const isDark = computed(() => theme.global.current.value.dark);

provide(KEYS.THEMES.IS_DARK, isDark);
</script>
