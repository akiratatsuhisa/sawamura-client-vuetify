<template>
  <v-row class="flex-column-reverse flex-md-row">
    <v-col cols="12" sm="12" md="7" lg="8">
      <v-card rounded="xl">
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
      <v-card class="bg-surface text-on-surface" rounded="xl">
        <v-toolbar color="surface-variant" rounded="xl">
          <v-btn
            size="small"
            :icon="isActive ? 'mdi-chart-line' : 'mdi-pause-circle-outline'"
            @click="isActive ? pause() : resume()"
          ></v-btn>

          <v-toolbar-title>{{ translate('subchart') }}</v-toolbar-title>

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
          class="mt-3"
          height="500"
          :options="options"
          :series="series"
        />
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
import { useIntervalFn } from '@vueuse/core';
import { ApexOptions } from 'apexcharts';
import dayjs from 'dayjs';
import _ from 'lodash';
import { computed, ref } from 'vue';
import { useTheme } from 'vuetify';

import {
  usePageLocale,
  useSocketDashboard,
  useSocketEventListener,
} from '@/composables';
import { IChartMessgesRequest, IChartMessgesResponse } from '@/interfaces';

const theme = useTheme();

const { translate } = usePageLocale({ prefix: 'dashboard.messages' });

const isExpand = ref<boolean>(true);

const options = computed<ApexOptions>(() => ({
  chart: {
    type: 'bar',
    background: theme.current.value.colors['surface'],
  },
  theme: {
    mode: theme.name.value === 'dark ' ? 'dark' : 'light',
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
    colors: [theme.name.value === 'dark' ? 'dark' : 'light'],
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
      fromDate: dayjs().subtract(11, 'months').startOf('month').toISOString(),
      toDate: dayjs().endOf('month').toISOString(),
    });
  },
  300000,
  { immediateCallback: true },
);
</script>
