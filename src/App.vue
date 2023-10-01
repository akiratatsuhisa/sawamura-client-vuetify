<template>
  <router-view :route="route" />

  <v-modals-container />
  <v-bottom-sheet-container />
  <v-alerts-container />
  <v-snackbars-container />
</template>

<script setup lang="ts">
import { useTitle } from '@vueuse/core';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import VAlertsContainer from '@/components/VAlertsContainer.vue';
import VBottomSheetContainer from '@/components/VBottomSheetContainer.vue';
import VModalsContainer from '@/components/VModalsContainer.vue';
import VSnackbarsContainer from '@/components/VSnackbarsContainer.vue';

import { useHistoryState, useRouteWithModal } from './composables';

const historyState = useHistoryState();
const route = useRouteWithModal(historyState);

const { t: translate } = useI18n();
useTitle(computed(() => translate('common.app.title')));
</script>
