<template>
  <v-card class="bg-surface" :rounded="fullscreen ? '0' : 'xl'">
    <v-toolbar class="bg-surface">
      <v-app-bar-nav-icon
        v-if="fullscreen !== undefined"
        :icon="fullscreen ? 'mdi-arrow-left' : 'mdi-close'"
        @click="close()"
      >
      </v-app-bar-nav-icon>
    </v-toolbar>

    <v-card-text class="overflow-y-auto">
      <v-text-field v-model="text" label="Whinny" />
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

import { useHistoryState } from '@/composables';

defineProps<{ fullscreen?: boolean; close: Function }>();

const state = useHistoryState();

const text = ref('');

text.value = state.value.props?.username
  ? `@${state.value.props.username}`
  : '';
</script>
