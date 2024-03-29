<template>
  <v-dialog
    v-if="isDialog"
    v-model="model"
    activator="parent"
    :persistent="persistent"
    :close-on-content-click="false"
  >
    <v-card rounded="xl">
      <template v-if="!hideTopbar">
        <v-toolbar density="comfortable">
          <v-app-bar-nav-icon :icon="closeIcon" @click="close" />

          <slot name="title">
            <v-toolbar-title>
              {{ title }}
            </v-toolbar-title>
          </slot>
        </v-toolbar>

        <v-divider />
      </template>

      <v-card-text class="pa-0" :class="{ 'overflow-y-auto': autoScroll }">
        <slot name="dialog-content" :close="close">
          <slot :is-dialog="isDialog" :is-menu="!isDialog" :close="close" />
        </slot>
      </v-card-text>
    </v-card>
  </v-dialog>

  <v-menu
    v-else
    v-model="model"
    activator="parent"
    :close-on-content-click="false"
    :width="width"
    :offset="offset"
    :location="location"
  >
    <v-card
      :width="width"
      class="bg-surface-container-high text-on-surface"
      rounded="xl"
    >
      <v-card-text class="overflow-y-auto pa-0">
        <slot name="menu-content" :close="close">
          <slot :is-dialog="isDialog" :is-menu="!isDialog" :close="close" />
        </slot>
      </v-card-text>
    </v-card>
  </v-menu>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useDisplay } from 'vuetify';

import { Anchor } from '@/helpers';

withDefaults(
  defineProps<{
    hideTopbar?: boolean;
    title?: string;
    persistent?: boolean | undefined;
    location?: Anchor;
    width?: string | number | undefined;
    offset?: string | number | number[] | undefined;
    closeIcon?: string;
    autoScroll?: boolean;
  }>(),
  {
    location: 'bottom',
    width: '400px',
    closeIcon: 'mdi-close',
    autoScroll: true,
  },
);

defineSlots<{
  default(props: { isDialog: boolean; isMenu: boolean; close(): void }): any;
  title(): any;
  'dialog-content'(props: { close(): void }): any;
  'menu-content'(props: { close(): void }): any;
}>();

const model = ref(false);

const display = useDisplay();

const isDialog = computed(() => display.smAndDown.value);

function close() {
  model.value = false;
}

defineExpose({ close });
</script>
