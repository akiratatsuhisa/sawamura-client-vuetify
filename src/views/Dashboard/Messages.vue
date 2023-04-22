<template>
  <v-row class="flex-column-reverse flex-md-row">
    <v-col cols="12" sm="12" md="7" lg="8">
      <v-card>
        <v-card-title>Infomation</v-card-title>
        <v-card-text>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis,
          et totam? Doloremque dolorem id nobis, unde beatae explicabo
          reiciendis iure soluta ipsa! Perferendis fugit laboriosam debitis
          eligendi, velit quod quam.
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" sm="12" md="5" lg="4">
      <v-card>
        <v-toolbar
          density="compact"
          color="surface"
          elevation="1"
          :class="[isExpand && 'mb-3']"
        >
          <v-btn
            size="small"
            :icon="isActive ? 'mdi-chart-line' : 'mdi-pause-circle-outline'"
            @click="isActive ? pause() : resume()"
          ></v-btn>

          <v-toolbar-title>Chart Messages</v-toolbar-title>

          <v-spacer></v-spacer>

          <v-btn
            size="small"
            :icon="isExpand ? 'mdi-chevron-down' : 'mdi-chevron-up'"
            @click="isExpand = !isExpand"
          ></v-btn>

          <v-progress-linear
            v-if="isLoadingChartMessages"
            absolute
            location="bottom"
            color="primary"
            indeterminate
          ></v-progress-linear>
        </v-toolbar>

        <apexchart
          v-if="isExpand"
          height="500"
          :options="options"
          :series="series"
        ></apexchart>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
import { useIntervalFn } from '@vueuse/core';
import { ApexOptions } from 'apexcharts';
import _ from 'lodash';
import moment from 'moment';
import { computed, ref } from 'vue';
import { useTheme } from 'vuetify';

import { useSocketDashboard } from '@/composables/useSocketDashboard';
import { useSocketEventListener } from '@/composables/useSocketEventListener';
import {
  IChartMessgesRequest,
  IChartMessgesResponse,
} from '@/interfaces/dashboard';

const theme = useTheme();

const isExpand = ref<boolean>(true);

const options = computed<ApexOptions>(() => ({
  chart: {
    type: 'bar',
    background: theme.current.value.colors.surface,
  },
  theme: {
    mode: theme.current.value.dark ? 'dark' : 'light',
  },
  plotOptions: {
    bar: {
      horizontal: true,
      borderRadius: 4,
      dataLabels: {
        position: 'center',
      },
    },
  },
  colors: [
    theme.current.value.colors.primary,
    theme.current.value.colors.secondary,
  ],
  stroke: {
    show: true,
    width: 1,
    colors: [theme.current.value.dark ? 'dark' : 'light'],
  },
}));

const series = ref<
  Array<{ name: string; data: Array<{ x: string; y: number }> }>
>([]);

const socket = useSocketDashboard();

const { isLoading: isLoadingChartMessages, request: requestChartMessages } =
  useSocketEventListener<IChartMessgesResponse, IChartMessgesRequest>(
    socket,
    'chart:messages',
    {
      response({ records }) {
        series.value = [
          {
            name: 'messages',
            data: _.map(records, (data) => ({
              x: data.label,
              y: data.countMessages,
            })),
          },
          {
            name: 'files',
            data: _.map(records, (data) => ({
              x: data.label,
              y: data.countFiles,
            })),
          },
        ];
      },
    },
  );

const { isActive, pause, resume } = useIntervalFn(
  () => {
    requestChartMessages({
      fromDate: moment().subtract(11, 'months').startOf('month').toISOString(),
      toDate: moment().endOf('month').toISOString(),
    });
  },
  300000,
  { immediateCallback: true },
);
</script>
