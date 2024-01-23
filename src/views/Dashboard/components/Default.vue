<template>
  <v-row class="flex-column-reverse flex-md-row">
    <v-col cols="12" md="6">
      <v-card class="bg-surface" variant="flat" rounded="xl">
        <v-toolbar class="bg-surface">
          <v-btn
            size="small"
            :icon="isActive ? 'mdi-abacus' : 'mdi-pause-circle-outline'"
            @click="isActive ? pause() : resume()"
          />

          <v-toolbar-title>{{ translate('mainchart.title') }}</v-toolbar-title>

          <v-progress-linear
            v-if="false"
            absolute
            location="bottom"
            color="primary"
            indeterminate
          />

          <v-btn
            size="small"
            :icon="isExpand ? 'mdi-chevron-up' : 'mdi-chevron-down'"
            @click="isExpand = !isExpand"
          />
        </v-toolbar>

        <apexchart
          v-if="isExpand"
          class="mt-3 candle-chart"
          :options="options"
          :series="series"
        />
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
import { useIntervalFn } from '@vueuse/core';
import { ApexOptions } from 'apexcharts';
import dayjs from 'dayjs';
import _ from 'lodash';
import { computed, reactive, ref } from 'vue';
import { useTheme } from 'vuetify/lib/framework.mjs';

import { usePageLocale } from '@/composables';
import { Format } from '@/helpers';
import VInfoCard, {
  InfoCardProps,
} from '@/views/Dashboard/components/InfoCard.vue';

const { translate } = usePageLocale({ prefix: 'dashboard.index' });

const theme = useTheme();

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

const isExpand = ref<boolean>(true);

const labels = ref<Array<string>>([]);

const options = computed<ApexOptions>(() => ({
  chart: {
    type: 'candlestick',
    background: 'rgb(var(--v-theme-surface))',
    foreColor: theme.current.value.colors['on-surface'],
  },
  theme: {
    mode: theme.name.value === 'dark' ? 'dark' : 'light',
  },
  labels: labels.value,
  yaxis: {
    decimalsInFloat: 2,
  },
}));

const now = dayjs().subtract(20, 'minutes');
const series = ref<
  Array<{
    name: string;
    data: Array<{ x: string; y: [Number, Number, Number, Number] }>;
  }>
>([
  {
    name: 'candle',
    data: Array.from(new Array(20)).map((_value, index) => ({
      x: Format.dateTime(now.clone().add(index, 'minutes'), {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
      y: [
        _.random(0, 10000, true),
        _.random(0, 10000, true),
        _.random(0, 10000, true),
        _.random(0, 10000, true),
      ],
    })),
  },
]);

const { isActive, pause, resume } = useIntervalFn(
  () => {
    series.value.at(0)?.data.push({
      x: Format.dateTime(
        dayjs(series.value.at(0)!.data!.at(-1)!.x).add(1, 'minute'),
        {
          dateStyle: 'medium',
          timeStyle: 'short',
        },
      ),
      y: [
        _.random(0, 10000, true),
        _.random(0, 10000, true),
        _.random(0, 10000, true),
        _.random(0, 10000, true),
      ],
    });
    series.value.at(0)?.data.shift();
  },
  60000,
  {
    immediateCallback: true,
  },
);
</script>

<style lang="scss">
.candle-chart {
  .apexcharts-menu {
    border: none !important;
    border-radius: 8px !important;
    background-color: rgb(var(--v-theme-surface-container-high)) !important;
    color: rgb(var(--v-theme-on-surface)) !important;

    .apexcharts-menu-item {
      background-color: rgb(var(--v-theme-surface-container-high)) !important;
    }
  }

  .apexcharts-tooltip {
    border: none !important;
    border-radius: 8px !important;
    background-color: rgb(var(--v-theme-surface-container-high)) !important;
    color: rgb(var(--v-theme-on-surface)) !important;

    .apexcharts-tooltip-title {
      background-color: rgb(
        var(--v-theme-surface-container-highest)
      ) !important;
      color: rgb(var(--v-theme-on-surface)) !important;
    }

    .apexcharts-tooltip-series-group {
      background-color: rgb(var(--v-theme-surface-container-high)) !important;
      color: rgb(var(--v-theme-on-surface)) !important;
    }

    .apexcharts-tooltip-title {
      border-bottom: solid 1px rgb(var(--v-theme-outline), 0.2) !important;
    }
  }
}
</style>
