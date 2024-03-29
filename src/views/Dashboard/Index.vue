<template>
  <v-main class="bg-surface-container">
    <v-container fluid>
      <v-sheet class="bg-surface" rounded="xl">
        <div>
          <v-breadcrumbs :items="breadcrumbs">
            <template #divider>
              <v-icon icon="mdi-chevron-right" />
            </template>

            <template #title="{ item: { title } }">
              {{ translate(`breadcrumbs.${title}`) }}
            </template>
          </v-breadcrumbs>
        </div>

        <v-divider />

        <div class="pa-2 text-end">
          <v-btn size="small" append-icon="mdi-table-arrow-left">
            {{ translate('import') }}
          </v-btn>
        </div>
      </v-sheet>

      <v-row class="mt-3">
        <v-col cols="12" sm="6" md="3">
          <v-info-card v-bind="statisticalData.dropbox">
            <v-progress-linear
              height="20"
              :model-value="statisticalData.dropbox.value"
              :max="statisticalData.dropbox.max as number"
              rounded="pill"
              class="my-auto"
              #default="{ value }"
            >
              <strong class="text-black text-overline">
                {{ value.toFixed(2) }} %
              </strong>
            </v-progress-linear>

            <span class="text-caption text-end info-text-caption">
              {{
                Format.binaryUnit(statisticalData.dropbox.value, {
                  outputUnit: BinaryUnit.Gibibyte,
                })
              }}
              |
              {{
                Format.binaryUnit(statisticalData.dropbox.max as number, {
                  outputUnit: BinaryUnit.Gibibyte,
                })
              }}
            </span>
          </v-info-card>
        </v-col>

        <v-col cols="12" sm="6" md="3">
          <v-info-card v-bind="statisticalData.cache">
            <v-progress-linear
              height="20"
              :model-value="statisticalData.cache.value"
              :max="statisticalData.cache.max as number"
              rounded="pill"
              class="my-auto"
              #default="{ value }"
            >
              <strong class="text-black text-overline">
                {{ value.toFixed(4) }} %
              </strong>
            </v-progress-linear>

            <span class="text-caption text-end info-text-caption">
              {{
                Format.binaryUnit(statisticalData.cache.value, {
                  outputUnit: BinaryUnit.Gibibyte,
                })
              }}
              |
              {{
                Format.binaryUnit(statisticalData.cache.max as number, {
                  outputUnit: BinaryUnit.Gibibyte,
                })
              }}
            </span>
          </v-info-card>
        </v-col>

        <v-col cols="12" sm="6" md="3">
          <v-info-card v-bind="statisticalData.posts" />
        </v-col>

        <v-col cols="12" sm="6" md="3">
          <v-info-card v-bind="statisticalData.users" />
        </v-col>
      </v-row>

      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component ? Component : VDefaultComponent" />
        </transition>
      </router-view>
    </v-container>
  </v-main>
</template>

<script lang="ts" setup>
import { SOCKET_EVENTS } from '@akiratatsuhisa/sawamura-utils';
import { useIntervalFn } from '@vueuse/core';
import _ from 'lodash';
import { computed, reactive } from 'vue';
import { useRoute } from 'vue-router';

import {
  initSocketDashboard,
  usePageLocale,
  useSocketEventListener,
} from '@/composables';
import { BinaryUnit, Format } from '@/helpers';
import {
  ICountUsersRequest,
  ICountUsersResponse,
  IStorageDropboxRequest,
  IStorageDropboxResponse,
} from '@/interfaces';
import VDefaultComponent from '@/views/Dashboard/components/Default.vue';
import VInfoCard, {
  InfoCardProps,
} from '@/views/Dashboard/components/InfoCard.vue';

const route = useRoute();

const { translate } = usePageLocale({ prefix: 'dashboard.index' });

const breadcrumbs = computed(() =>
  _(route.matched)
    .map((r) => r.meta.breadcrumb)
    .filter((b) => !_.isUndefined(b))
    .value(),
);

const socket = initSocketDashboard();

const statisticalData = reactive<
  Record<
    'dropbox' | 'cache' | 'posts' | 'users',
    InfoCardProps & Record<string, unknown>
  >
>({
  dropbox: {
    name: 'dropbox',
    color: 'blue',
    icon: 'mdi-dropbox',
    value: 0,
    max: 0,
  },
  cache: {
    name: 'cache',
    color: 'purple',
    icon: 'mdi-server',
    value: 0,
    max: 8_589_934_592,
  },
  posts: {
    name: 'posts',
    color: 'yellow',
    icon: 'mdi-post',
    value: 0,
  },
  users: {
    name: 'users',
    color: 'green',
    icon: 'mdi-account-group',
    value: 0,
  },
});

const { request: requestStorageDropbox } = useSocketEventListener<
  IStorageDropboxResponse,
  IStorageDropboxRequest
>(socket, SOCKET_EVENTS.DASHBOARD_EVENTS.READ_STORAGE_DROPBOX, {
  response(data) {
    statisticalData.dropbox.value = data.used;
    statisticalData.dropbox.max = data.allocated;
  },
});

const { request: requestCountUsers } = useSocketEventListener<
  ICountUsersResponse,
  ICountUsersRequest
>(socket, SOCKET_EVENTS.DASHBOARD_EVENTS.READ_COUNT_USERS, {
  response(data) {
    statisticalData.users.value = data.count;
  },
});

useIntervalFn(
  () => {
    requestStorageDropbox({ data: null });
    requestCountUsers({ data: null });
  },
  300000,
  { immediateCallback: true },
);
</script>

<style lang="scss" scoped>
.info-text-caption {
  font-size: 10px !important;
  line-height: 12px !important;
}

.fade-enter-active {
  transition: opacity 0.3s ease;
}
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
