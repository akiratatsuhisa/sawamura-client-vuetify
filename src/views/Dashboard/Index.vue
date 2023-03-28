<template>
  <v-main>
    <v-container fluid>
      <v-sheet elevation="2" rounded="lg">
        <div>
          <v-breadcrumbs :items="breadcrumbs">
            <template v-slot:divider>
              <v-icon icon="mdi-chevron-right"></v-icon>
            </template>
          </v-breadcrumbs>
        </div>

        <v-divider></v-divider>
        <div class="pa-2 text-end">
          <v-btn
            variant="tonal"
            size="small"
            append-icon="mdi-table-arrow-left"
          >
            Import CSV
          </v-btn>
        </div>
      </v-sheet>

      <v-row class="my-3">
        <v-col cols="12" sm="6" md="3">
          <info-card v-bind="statisticalData.revenue">
            <div class="text-h5 my-auto">
              {{
                Format.currency(statisticalData.revenue.value, {
                  currency: 'VND',
                })
              }}
            </div>
          </info-card>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <info-card v-bind="statisticalData.cache">
            <v-progress-linear
              height="24"
              :model-value="statisticalData.cache.value"
              :max="MAX_CACHE"
              rounded="pill"
              class="my-auto"
            >
              <template v-slot:default="{ value }">
                <strong class="text-black text-overline">
                  {{ value.toFixed(4) }} %
                </strong>
              </template>
            </v-progress-linear>
            <span class="text-caption text-end"
              >{{
                Format.binaryUnit(statisticalData.cache.value, {
                  outputUnit: BinaryUnit.Gibibyte,
                })
              }}
              |
              {{
                Format.binaryUnit(MAX_CACHE, {
                  outputUnit: BinaryUnit.Gibibyte,
                })
              }}</span
            >
          </info-card>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <info-card v-bind="statisticalData.users"></info-card>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <info-card v-bind="statisticalData.emails"></info-card>
        </v-col>
      </v-row>

      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component ? Component : DefaultComponent" />
        </transition>
      </router-view>
    </v-container>
  </v-main>
</template>

<script lang="ts" setup>
import _ from 'lodash';
import { computed, reactive } from 'vue';
import { useRoute } from 'vue-router';

import { BinaryUnit, Format } from '@/helpers/format';
import InfoCard, { InfoCardProps } from '@/views/Dashboard/InfoCard.vue';

import DefaultComponent from './Default.vue';

const MAX_CACHE = 8_589_934_592;

const route = useRoute();

const breadcrumbs = computed(() =>
  _(route.matched)
    .map((r) => r.meta.breadcrumb)
    .filter((r) => !_.isUndefined(r))
    .value(),
);

const statisticalData = reactive<
  Record<'revenue' | 'cache' | 'users' | 'emails', InfoCardProps>
>({
  revenue: {
    color: 'red',
    icon: 'mdi-cash-multiple',
    name: 'Revenue',
    value: 100000000,
  },
  cache: {
    color: 'purple',
    icon: 'mdi-server',
    name: 'Cache Files',
    value: 4_294_967_296,
  },
  users: {
    color: 'green',
    icon: 'mdi-account-group',
    name: 'Users',
    value: 4544012,
  },
  emails: {
    color: 'blue',
    icon: 'mdi-email-multiple',
    name: 'Sendgrid E-mail',
    value: 53121,
  },
});
</script>

<style lang="scss" scoped>
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
