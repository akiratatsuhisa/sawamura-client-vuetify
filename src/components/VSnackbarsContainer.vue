<template>
  <v-custom-snackbar v-for="item in items" :key="item.id" v-bind="item" />
</template>

<script setup lang="ts">
import { inject } from 'vue';

import VCustomSnackbar from '@/components/VCustomSnackbar.vue';
import { KEYS } from '@/constants';

const items = inject(KEYS.SNACKBARS)!;
</script>
