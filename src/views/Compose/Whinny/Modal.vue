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
    <v-divider />

    <v-card-text class="pa-0 overflow-y-auto">
      <v-whinny-input
        :type="state.props.type"
        :reference-username="
          state.props.username ? state.props.username : undefined
        "
        :reference-whinny="state.props.whinny"
      />
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import VWhinnyInput from '@/components/Whinnies/WhinnyInput.vue';
import { useHistoryState } from '@/composables';

defineProps<{ fullscreen?: boolean; close: Function }>();

const state = useHistoryState();
</script>
