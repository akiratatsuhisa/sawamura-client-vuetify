<template>
  <v-custom-alert
    v-for="item in items"
    :key="item.id"
    v-bind="item"
  ></v-custom-alert>
</template>

<script setup lang="ts">
import { inject } from 'vue';

import VCustomAlert from '@/components/VCustomAlert.vue';
import { KEYS } from '@/constants';

const items = inject(KEYS.ALERTS)!;
</script>
