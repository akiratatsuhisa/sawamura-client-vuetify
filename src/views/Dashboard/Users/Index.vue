<template>
  <v-row class="flex-column-reverse flex-md-row">
    <v-col cols="12" sm="12" md="7" lg="8">
      <v-card class="bg-surface" variant="flat" rounded="xl">
        <v-tabs
          bg-color="transparent"
          :model-value="tab"
          @update:model-value="
            (value: any) => router.push({ name: value as string })
          "
          grow
        >
          <v-tab v-for="tab in tabs" :key="tab.title" :value="tab.name">
            {{ translate(`tabs.${tab.title}`) }}
          </v-tab>
        </v-tabs>
        <v-divider />

        <v-window
          :model-value="tab"
          @update:model-value="
            (value: any) => router.push({ name: value as string })
          "
        >
          <v-window-item :value="tabs.Information.name">
            <v-user-view v-if="tab === 'Dashboard:Users'" />
          </v-window-item>
          <v-window-item :value="tabs.Roles.name">
            <v-role-view v-if="tab === 'Dashboard:Users:Roles'" />
          </v-window-item>
        </v-window>
      </v-card>
    </v-col>

    <v-col cols="12" sm="12" md="5" lg="4">
      <v-card class="bg-surface" variant="flat" rounded="xl">
        <v-toolbar class="bg-surface">
          <v-btn
            size="small"
            :icon="isActive ? 'mdi-chart-donut' : 'mdi-pause-circle-outline'"
            @click="isActive ? pause() : resume()"
          />

          <v-toolbar-title>{{ translate('subchart') }}</v-toolbar-title>
          <v-progress-linear
            v-if="isLoadingChartUserRoles"
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
          class="mt-3"
          :options="options"
          :series="series"
        />
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
import { SOCKET_EVENTS } from '@akiratatsuhisa/sawamura-utils';
import { useIntervalFn } from '@vueuse/core';
import { ApexOptions } from 'apexcharts';
import _ from 'lodash';
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useTheme } from 'vuetify';

import {
  usePageLocale,
  useSocketDashboard,
  useSocketEventListener,
} from '@/composables';
import { IChartUserRolesRequest, IChartUserRolesResponse } from '@/interfaces';
import VRoleView from '@/views/Dashboard/Users/Roles/View.vue';
import VUserView from '@/views/Dashboard/Users/View.vue';

const theme = useTheme();

const route = useRoute();
const router = useRouter();
const { translate } = usePageLocale({ prefix: 'dashboard.users' });

const tabs = {
  Information: {
    title: 'information',
    name: 'Dashboard:Users',
  },
  Roles: {
    title: 'roles',
    name: 'Dashboard:Users:Roles',
  },
};
const tab = computed(() => route.name);

const isExpand = ref<boolean>(true);

const labels = ref<Array<string>>([]);

const options = computed<ApexOptions>(() => ({
  chart: {
    type: 'donut',
    background: theme.current.value.colors['surface'],
    foreColor: theme.current.value.colors['on-surface'],
  },
  theme: {
    mode: theme.name.value === 'dark' ? 'dark' : 'light',
  },
  labels: labels.value,
}));

const series = ref<Array<number>>([]);

const socket = useSocketDashboard();

const { isLoading: isLoadingChartUserRoles, request: requestChartUserRoles } =
  useSocketEventListener<IChartUserRolesResponse, IChartUserRolesRequest>(
    socket,
    SOCKET_EVENTS.DASHBOARD_EVENTS.CHART_USER_ROLES,
    {
      response({ records }) {
        labels.value = _.map(records, 'name');
        series.value = _.map(records, 'count');
      },
    },
  );

const { isActive, pause, resume } = useIntervalFn(
  () => {
    requestChartUserRoles({
      data: null,
    });
  },
  300000,
  { immediateCallback: true },
);
</script>
