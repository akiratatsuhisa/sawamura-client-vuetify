<template>
  <v-row class="flex-column-reverse flex-md-row">
    <v-col cols="12" md="6">
      <v-card class="bg-surface" variant="flat" rounded="xl">
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
          <v-info-card v-bind="statisticalData.pdf" />
        </v-col>

        <v-col cols="12" sm="6">
          <v-info-card v-bind="statisticalData.reports" />
        </v-col>

        <v-col cols="12" sm="6">
          <v-info-card v-bind="statisticalData.bugs" />
        </v-col>

        <v-col cols="12" sm="6">
          <v-info-card v-bind="statisticalData.revenue" />
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';

import VInfoCard, {
  InfoCardProps,
} from '@/views/Dashboard/components/InfoCard.vue';

const statisticalData = reactive<
  Record<
    'pdf' | 'reports' | 'bugs' | 'revenue',
    InfoCardProps & Record<string, unknown>
  >
>({
  pdf: {
    name: 'pdf',
    color: 'indigo',
    icon: 'mdi-printer',
    value: 0,
  },
  reports: {
    name: 'reports',
    color: 'orange',
    icon: 'mdi-file-chart',
    value: 0,
  },
  bugs: {
    name: 'bugs',
    color: 'red',
    icon: 'mdi-bug',
    value: 0,
  },
  revenue: {
    name: 'revenue',
    color: 'light-green',
    icon: 'mdi-cash-multiple',
    value: 0,
  },
});
</script>
