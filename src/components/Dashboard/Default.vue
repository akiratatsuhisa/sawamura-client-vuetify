<template>
  <v-row class="flex-column-reverse flex-md-row">
    <v-col cols="12" md="6">
      <v-card>
        <v-card-title>Default</v-card-title>
        <v-card-text>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis,
          et totam? Doloremque dolorem id nobis, unde beatae explicabo
          reiciendis iure soluta ipsa! Perferendis fugit laboriosam debitis
          eligendi, velit quod quam.
        </v-card-text>
      </v-card>
    </v-col>

    <v-col cols="12" md="6">
      <v-row>
        <v-col cols="12" sm="6">
          <info-card v-bind="statisticalData.print"></info-card>
        </v-col>
        <v-col cols="12" sm="6">
          <info-card v-bind="statisticalData.report"></info-card>
        </v-col>
        <v-col cols="12" sm="6">
          <info-card v-bind="statisticalData.bugs"></info-card>
        </v-col>
        <v-col cols="12" sm="6">
          <info-card v-bind="statisticalData.revenue"></info-card>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';

import InfoCard, { InfoCardProps } from '@/components/Dashboard/InfoCard.vue';

const statisticalData = reactive<
  Record<
    'print' | 'report' | 'bugs' | 'revenue',
    InfoCardProps & Record<string, unknown>
  >
>({
  print: {
    color: 'indigo',
    icon: 'mdi-printer',
    name: 'PDF',
    value: 0,
  },
  report: {
    color: 'orange',
    icon: 'mdi-file-chart',
    name: 'Report',
    value: 0,
  },
  bugs: {
    color: 'red',
    icon: 'mdi-bug',
    name: 'Bugs',
    value: 0,
  },
  revenue: {
    color: 'light-green',
    icon: 'mdi-cash-multiple',
    name: 'Revenue',
    value: 0,
  },
});
</script>
