<template>
  <v-main class="bg-surface-container">
    <v-container
      fluid
      class="fill-height text-center"
      :class="[$vuetify?.display.smAndDown ? 'pa-0' : 'pa-4']"
    >
      <v-responsive
        class="bg-surface h-100 d-flex align-center justify-center"
        :class="[$vuetify?.display.smAndDown ? 'rounded-0' : 'rounded-lg']"
      >
        <h1>Status {{ route.params.id }}</h1>
      </v-responsive>
    </v-container>

    <v-fade-transition>
      <v-floating-action-button
        icon="mdi-chat-plus-outline"
        :is-fab-show="display.smAndDown.value"
        @click="openModalComposeWhinny"
      />
    </v-fade-transition>
  </v-main>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useDisplay } from 'vuetify';

import {
  useBackgroundRoute,
  useNavigationRailFab,
  useRouterModal,
} from '@/composables';

const route = useBackgroundRoute();

const { openModal } = useRouterModal();

function openModalComposeWhinny() {
  openModal(
    { name: 'Compose:Whinny' },
    {
      username: route.value.params.username,
    },
  );
}

const display = useDisplay();
useNavigationRailFab(
  computed(() => ({
    isFabShow: display.mdAndUp.value,
    icon: 'mdi-chat-plus-outline',
    onClick: openModalComposeWhinny,
  })),
);
</script>
