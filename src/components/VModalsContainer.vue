<template>
  <v-custom-modal
    :desktop-width="historyState?.props?.desktopWidth || '50%'"
    v-model="modal"
    #default="{ fullscreen, close }"
  >
    <v-card v-if="!modal" class="bg-surface" :rounded="fullscreen ? '0' : 'xl'">
      <v-toolbar class="bg-surface">
        <v-app-bar-nav-icon
          v-if="fullscreen !== undefined"
          :icon="fullscreen ? 'mdi-arrow-left' : 'mdi-close'"
          @click="close()"
        >
        </v-app-bar-nav-icon>
      </v-toolbar>

      <v-divider />

      <v-card-text class="py-12 d-flex align-center justify-center">
        <v-progress-circular
          size="64"
          width="4"
          color="primary"
          indeterminate
        />
      </v-card-text>
    </v-card>

    <v-compose-whinny
      v-else-if="router.currentRoute.value.name === 'Compose:Whinny'"
      :fullscreen="fullscreen"
      :close="close"
      v-bind="historyState.props"
    />
  </v-custom-modal>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue';
import { useRouter } from 'vue-router';

import VCustomModal from '@/components/VCustomModal.vue';
import { useHistoryState } from '@/composables';

const VComposeWhinny = defineAsyncComponent(
  () => import('@/views/Compose/Whinny/Modal.vue'),
);

const router = useRouter();
const historyState = useHistoryState();

const modal = computed({
  get() {
    return !!historyState.value.background;
  },
  set(_value: boolean) {
    router.back();
  },
});
</script>
