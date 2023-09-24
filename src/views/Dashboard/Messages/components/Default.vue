<template>
  <v-card class="bg-surface" variant="flat" rounded="xl">
    <v-toolbar class="bg-surface">
      <v-btn size="small" icon="mdi-chart-multiple" />

      <v-toolbar-title>{{ translate('mainchart.title') }}</v-toolbar-title>

      <v-btn
        size="small"
        :icon="isExpand ? 'mdi-chevron-up' : 'mdi-chevron-down'"
        @click="isExpand = !isExpand"
      />

      <v-progress-linear
        v-if="loading"
        absolute
        location="bottom"
        color="primary"
        indeterminate
      ></v-progress-linear>
    </v-toolbar>

    <apexchart
      v-if="isExpand && !loading && series.length"
      class="mt-3 messages-chart"
      height="520"
      :options="options"
      :series="series"
    />
  </v-card>
</template>

<script lang="ts" setup>
import { ApexOptions } from 'apexcharts';
import _ from 'lodash';
import { computed, ref } from 'vue';
import { useTheme } from 'vuetify';

import { usePageLocale } from '@/composables';

const props = defineProps<{
  loading?: boolean;
  series?: Array<{ name: string; type: string; data: Array<number> }>;
  labels?: Array<string>;
}>();

const theme = useTheme();
const { translate } = usePageLocale({ prefix: 'dashboard.messages' });

const isExpand = ref<boolean>(true);

const options = computed<ApexOptions>(() => ({
  chart: {
    type: 'line',
    background: theme.current.value.colors['surface'],
    foreColor: theme.current.value.colors['on-surface'],
    toolbar: {
      tools: {
        download: false,
        selection: true,
        zoom: true,
        zoomin: true,
        zoomout: true,
        pan: true,
        reset: true,
      },
    },
  },
  theme: {
    mode: theme.name.value === 'dark ' ? 'dark' : 'light',
  },
  dataLabels: {
    style: {
      colors: [theme.current.value.colors['on-surface']],
    },
  },
  markers: {
    size: 4,
  },
  plotOptions: {
    bar: {
      columnWidth: '20%',
      borderRadius: 2,
    },
  },
  colors: [
    theme.current.value.colors['primary'],
    theme.current.value.colors['primary-container'],
    theme.current.value.colors['secondary'],
    theme.current.value.colors['secondary-container'],
  ],
  xaxis: { categories: props.labels },
  yaxis: [
    {
      seriesName: translate(`mainchart.xAxis.groupRooms`),
      axisTicks: {
        show: true,
      },
      axisBorder: {
        show: true,
      },
      title: {
        text: translate('mainchart.yAxis.rooms'),
      },
    },
    {
      seriesName: translate(`mainchart.xAxis.groupRooms`),
      show: false,
    },
    {
      opposite: true,
      seriesName: translate(`mainchart.xAxis.groupRoomMembers`),
      axisTicks: {
        show: true,
      },
      axisBorder: {
        show: true,
      },
      title: {
        text: translate('mainchart.yAxis.roomMembers'),
      },
    },
    {
      opposite: true,
      seriesName: translate(`mainchart.xAxis.groupRoomMembers`),
      show: false,
    },
  ],
}));

const series = computed(() =>
  _.map(props.series, (object) => ({
    name: translate(`mainchart.xAxis.${object.name}`),
    type: object.type,
    data: object.data,
  })),
);
</script>
