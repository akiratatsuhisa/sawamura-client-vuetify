<template>
  <router-view></router-view>

  <v-alerts-container />
  <v-snackbars-container />
</template>

<script setup lang="ts">
import { useTitle } from '@vueuse/core';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import VAlertsContainer from '@/components/VAlertsContainer.vue';
import VSnackbarsContainer from '@/components/VSnackbarsContainer.vue';

const { t: translate } = useI18n();
useTitle(computed(() => translate('common.app.title')));
</script>
