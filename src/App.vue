<template>
  <router-view></router-view>
</template>

<script setup lang="ts">
import { computed, provide } from 'vue';
import { useTheme } from 'vuetify';

import { KEYS } from './constants';

const theme = useTheme();

const isDark = computed(() => theme.global.current.value.dark);

provide(KEYS.THEMES.IS_DARK, isDark);
</script>
