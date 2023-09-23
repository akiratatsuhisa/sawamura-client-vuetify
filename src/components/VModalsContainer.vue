<template>
  <v-custom-modal
    :desktop-width="historyState?.props?.desktopWidth || 500"
    v-model="modal"
    #default="{ fullscreen, close }"
  >
    <v-scale-transition>
      <div v-if="!modal"></div>
      <v-compose-whinny
        v-else-if="router.currentRoute.value.name === 'Compose:Whinny'"
        :fullscreen="fullscreen"
        :close="close"
        v-bind="historyState.props"
      />
      <div v-else></div>
    </v-scale-transition>
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
