<template>
  <v-sheet
    class="h-100 d-flex flex-nowrap"
    :color="`${color}-lighten-1`"
    elevation="1"
    rounded="xl"
  >
    <v-avatar
      class="my-3 ml-3 elevation-1"
      :color="`${color}-lighten-3`"
      size="48"
    >
      <v-icon :icon="icon" size="24" />
    </v-avatar>

    <div class="pa-2 d-flex flex-column flex-grow-1 flex-shrink-1">
      <div class="text-subtitle-2">
        {{ $t(`pages.dashboard.shared.cards.${name}`) }}
      </div>

      <slot>
        <div class="text-h5 my-auto">
          {{ Format.number(value) }}
        </div>
      </slot>
    </div>
  </v-sheet>
</template>

<script lang="ts" setup>
import { Format } from '@/helpers';

export type InfoCardProps = {
  color: string;
  icon: string;
  name: string;
  value?: string | number;
};

defineProps<InfoCardProps>();
</script>
