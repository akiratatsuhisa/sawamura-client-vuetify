<template>
  <h3 class="text-h5">Connected accounts</h3>
  <span class="text-subtitle-2 font-weight-light text-high-emphasis">
    These are the social accounts you connected to your Sawamura account to log
    in. You can enable or disable access here.
  </span>
  <template v-for="(name, provider) in PROVIDERS" :key="provider">
    <div class="d-flex justify-space-between py-2 align-center">
      <v-list-item>
        <template #prepend>
          <v-avatar :image="`/logos/${provider}.svg`" size="24" rounded="0" />
        </template>
        <template #title>{{ name }}</template>
        <template #subtitle>
          <div
            v-if="isProviderLinked(provider)"
            class="text-success d-flex align-center"
          >
            <v-icon start>mdi-check-circle-outline</v-icon>
            <span>Connected</span>
          </div>
          <div v-else class="text-error d-flex align-center">
            <v-icon start>mdi-close-circle-outline</v-icon>
            <span>Unconnected</span>
          </div>
        </template>
      </v-list-item>

      <div>
        <v-btn
          v-if="isProviderLinked(provider)"
          :loading="isLoading"
          variant="tonal"
          @click="unlinkProvider(provider)"
        >
          Dsiable
        </v-btn>
        <v-btn
          v-else
          variant="flat"
          :loading="isLoading"
          @click="linkProvider(provider)"
        >
          Enable
        </v-btn>
      </div>
    </div>

    <v-divider></v-divider>
  </template>
</template>

<script lang="ts" setup>
import _ from 'lodash';
import { computed, watch } from 'vue';

import { useAxios, useOauth } from '@/composables';
import { PROVIDERS } from '@/constants';
import { services } from '@/services';

const { linkProvider, unlinkProvider, isLoadingUnlinkProvider } =
  useOauth(true);

const {
  excute: excuteFindProviders,
  isLoading: isLoadingFindProviders,
  data,
} = useAxios(services.oauth, 'getProviders', {
  immediate: true,
  paramsOrData: {},
});

function isProviderLinked(provider: string) {
  return _.some(data.value, ({ providerName }) => providerName === provider);
}

watch(isLoadingUnlinkProvider, (current) => {
  if (current) {
    return;
  }

  excuteFindProviders({});
});

const isLoading = computed(
  () => isLoadingUnlinkProvider.value || isLoadingFindProviders.value,
);
</script>
