<template>
  <v-row class="flex-column-reverse flex-md-row">
    <v-col cols="12" sm="12" md="7" lg="8">
      <v-default
        :loading="isLoadingChartMessagesRooms"
        :labels="mainLabels"
        :series="mainSeries"
      />
    </v-col>
    <v-col cols="12" sm="12" md="5" lg="4">
      <v-card class="bg-surface" variant="flat" rounded="xl">
        <v-toolbar class="bg-surface">
          <v-btn
            size="small"
            :icon="isActive ? 'mdi-chart-line' : 'mdi-pause-circle-outline'"
            @click="isActive ? pause() : resume()"
          />

          <v-toolbar-title>{{ translate('subchart.title') }}</v-toolbar-title>
          <v-progress-linear
            v-if="isLoadingChartMessages"
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
          class="mt-3 messages-chart"
          height="1000"
          :options="subOptions"
          :series="subSeries"
        />
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
import { SOCKET_EVENTS } from '@akiratatsuhisa/sawamura-utils';
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
import {
  IChartMessgesRequest,
  IChartMessgesResponse,
  IChartMessgesRoomsRequest,
  IChartMessgesRoomsResponse,
} from '@/interfaces';
import VDefault from '@/views/Dashboard/Messages/components/Default.vue';

const theme = useTheme();
const { translate } = usePageLocale({ prefix: 'dashboard.messages' });

const socket = useSocketDashboard();

const isExpand = ref<boolean>(true);
const subOptions = computed<ApexOptions>(() => ({
  chart: {
    type: 'bar',
    background: theme.current.value.colors['surface'],
    foreColor: theme.current.value.colors['on-surface'],
  },
  theme: {
    mode: theme.name.value === 'dark ' ? 'dark' : 'light',
  },
  dataLabels: {
    style: {
      colors: [theme.current.value.colors['on-surface']],
    },
  },
  stroke: {
    show: true,
    width: 1,
    colors: [theme.name.value === 'dark' ? 'dark' : 'light'],
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
}));
const series = ref<
  Array<{ name: string; data: Array<{ x: string; y: number }> }>
>([]);
const subSeries = computed(() =>
  _.map(series.value, (object) => ({
    name: translate(`subchart.labels.${object.name}`),
    data: object.data,
  })),
);
const { isLoading: isLoadingChartMessages, request: requestChartMessages } =
  useSocketEventListener<IChartMessgesResponse, IChartMessgesRequest>(
    socket,
    SOCKET_EVENTS.DASHBOARD_EVENTS.CHART_MESSAGES,
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
            name: 'images',
            data: _.map(records, (data) => ({
              x: data.label,
              y: data.countImages,
            })),
          },
          {
            name: 'audios',
            data: _.map(records, (data) => ({
              x: data.label,
              y: data.countAudios,
            })),
          },
          {
            name: 'videos',
            data: _.map(records, (data) => ({
              x: data.label,
              y: data.countVideos,
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

const mainLabels = ref<Array<string>>();
const mainSeries = ref<
  Array<{ name: string; type: string; data: Array<number> }>
>([]);

const {
  isLoading: isLoadingChartMessagesRooms,
  request: requestChartMessagesRooms,
} = useSocketEventListener<
  IChartMessgesRoomsResponse,
  IChartMessgesRoomsRequest
>(socket, SOCKET_EVENTS.DASHBOARD_EVENTS.CHART_MESSAGES_ROOMS, {
  response({ records }) {
    mainLabels.value = _.map(records, 'label');

    mainSeries.value = [
      {
        name: 'groupRooms',
        type: 'column',
        data: _.map(records, 'countGroupRooms'),
      },
      {
        name: 'privateRooms',
        type: 'column',
        data: _.map(records, 'countPrivateRooms'),
      },
      {
        name: 'groupRoomMembers',
        type: 'line',
        data: _.map(records, 'countGroupRoomMembers'),
      },
      {
        name: 'privateRoomMembers',
        type: 'line',
        data: _.map(records, 'countPrivateRoomMembers'),
      },
    ];
  },
});

const { isActive, pause, resume } = useIntervalFn(
  () => {
    const fromDate = dayjs()
      .subtract(11, 'months')
      .startOf('month')
      .toISOString();
    const toDate = dayjs().endOf('month').toISOString();

    requestChartMessages({
      fromDate,
      toDate,
    });
    requestChartMessagesRooms({
      fromDate,
      toDate,
    });
  },
  300000,
  { immediateCallback: true },
);
</script>

<style lang="scss">
.messages-chart {
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
