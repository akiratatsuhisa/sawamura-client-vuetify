<template>
  <v-row class="flex-column-reverse flex-md-row">
    <v-col cols="12" sm="12" md="7" lg="8">
      <v-card>
        <v-tabs
          bg-color="transparent"
          :model-value="tab"
          @update:model-value="(value) => router.push({ name: value as string })"
          grow
        >
          <v-tab v-for="tab in tabs" :key="tab.title" :value="tab.name">
            {{ tab.title }}
          </v-tab>
        </v-tabs>

        <v-window :model-value="tab">
          <v-window-item :value="tabs.Information.name">
            <index-view></index-view>
          </v-window-item>
          <v-window-item :value="tabs.Roles.name">
            <v-fade-transition>
              <role-list v-if="route.name === tabs.Roles.name"></role-list>
            </v-fade-transition>
          </v-window-item>
        </v-window>
      </v-card>
    </v-col>

    <v-col cols="12" sm="12" md="5" lg="4">
      <v-card>
        <v-toolbar
          density="compact"
          color="surface"
          elevation="3"
          :class="[isExpand && 'mb-3']"
        >
          <v-btn
            size="small"
            :icon="isActive ? 'mdi-chart-donut' : 'mdi-pause-circle-outline'"
            @click="isActive ? pause() : resume()"
          ></v-btn>

          <v-toolbar-title>Chart User Roles</v-toolbar-title>

          <v-spacer></v-spacer>

          <v-btn
            size="small"
            :icon="isExpand ? 'mdi-chevron-down' : 'mdi-chevron-up'"
            @click="isExpand = !isExpand"
          ></v-btn>

          <v-progress-linear
            v-if="isLoadingChartUserRoles"
            absolute
            location="bottom"
            color="primary"
            indeterminate
          ></v-progress-linear>
        </v-toolbar>

        <apexchart
          v-if="isExpand"
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
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useTheme } from 'vuetify';

import IndexView from '@/components/Dashboard/Users/Index.vue';
import RoleList from '@/components/Dashboard/Users/RoleList.vue';
import { useSocketDashboard } from '@/composables/useSocketDashboard';
import { useSocketEventListener } from '@/composables/useSocketEventListener';
import {
  IChartUserRolesRequest,
  IChartUserRolesResponse,
} from '@/interfaces/dashboard';

const theme = useTheme();

const router = useRouter();
const route = useRoute();

const tabs = ref({
  Information: {
    title: 'Information',
    name: 'Dashboard:Users',
  },
  Roles: {
    title: 'Roles',
    name: 'Dashboard:Users:Roles',
  },
});
const tab = computed(() => route.name);

const isExpand = ref<boolean>(true);

const labels = ref<Array<string>>([]);

const options = computed<ApexOptions>(() => ({
  chart: {
    type: 'donut',
    background: theme.current.value.colors.surface,
  },
  theme: {
    mode: theme.current.value.dark ? 'dark' : 'light',
  },
  labels: labels.value,
}));

const series = ref<Array<number>>([]);

const socket = useSocketDashboard();

const { isLoading: isLoadingChartUserRoles, request: requestChartUserRoles } =
  useSocketEventListener<IChartUserRolesResponse, IChartUserRolesRequest>(
    socket,
    'chart:userRoles',
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
