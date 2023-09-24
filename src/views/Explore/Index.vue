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
        <h1>
          {{ $t('pages.explore.content') }}
        </h1>
      </v-responsive>
    </v-container>

    <v-fade-transition>
      <v-floating-action-button
        icon="mdi-pencil-plus-outline"
        :is-fab-show="display.smAndDown.value"
        :style="{ bottom: display.xs.value ? '80px' : '0' }"
        @click="openModal({ name: 'Compose:Whinny' })"
      />
    </v-fade-transition>
  </v-main>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useDisplay } from 'vuetify';

import { useNavigationRailFab, useRouterModal } from '@/composables';

const { openModal } = useRouterModal();

const display = useDisplay();
useNavigationRailFab(
  computed(() => ({
    isFabShow: display.mdAndUp.value,
    icon: 'mdi-pencil-plus-outline',
    onClick: () => {
      openModal({ name: 'Compose:Whinny' });
    },
  })),
);
</script>
