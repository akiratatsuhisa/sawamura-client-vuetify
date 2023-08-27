<template>
  <h3 class="text-h5">{{ translateConnectedAccounts('title') }}</h3>
  <span class="text-subtitle-2 font-weight-light text-high-emphasis">
    {{ translateConnectedAccounts('subtitle') }}
  </span>

  <template v-for="(detail, provider) in providers" :key="provider">
    <div class="d-flex justify-space-between py-2 align-center">
      <v-list-item>
        <template #prepend>
          <v-avatar :image="detail.image" size="24" rounded="0" />
        </template>
        <template #title>{{ detail.name }}</template>
        <template #subtitle>
          <div
            v-if="isProviderLinked(provider)"
            class="text-success d-flex align-center"
          >
            <v-icon start>mdi-check-circle-outline</v-icon>
            <span>{{ translateShared('connectStates.connected') }}</span>
          </div>
          <div v-else class="text-error d-flex align-center">
            <v-icon start>mdi-close-circle-outline</v-icon>
            <span>{{ translateShared('connectStates.unconnected') }}</span>
          </div>
        </template>
      </v-list-item>

      <div>
        <v-btn
          v-if="isProviderLinked(provider)"
          :loading="isLoading"
          variant="tonal"
          @click="onRequestUnlinkProvider(provider)"
        >
          {{ translateShared('activeStates.disable') }}
        </v-btn>
        <v-btn
          v-else
          variant="flat"
          :loading="isLoading"
          @click="linkProvider(provider)"
        >
          {{ translateShared('activeStates.enable') }}
        </v-btn>
      </div>
    </div>

    <v-divider />
  </template>
</template>

<script lang="ts" setup>
import _ from 'lodash';
import { computed, watch } from 'vue';

import { useAlert, useAxios, useOauth, usePageLocale } from '@/composables';
import { services } from '@/services';

const {
  translate: translateConnectedAccounts,
  translateShared,
  makeTranslateAlert: makeTranslateAlertConnectedAccounts,
} = usePageLocale({
  prefix: 'settings.oauthProviders.connectedAccounts',
});
const alert = useAlert();

const { providers, linkProvider, unlinkProvider, isLoadingUnlinkProvider } =
  useOauth(true);

const translateAlertConnectedAccounts =
  makeTranslateAlertConnectedAccounts('unlink');

async function onRequestUnlinkProvider(provider: string) {
  const { isConfirm } = await alert.fire({
    cancelButton: {
      show: true,
      text: translateAlertConnectedAccounts('cancel'),
    },
    confirmButton: {
      show: true,
      text: translateAlertConnectedAccounts('confirm'),
    },
    message: translateAlertConnectedAccounts('message', { provider }),
  });

  if (!isConfirm) {
    return true;
  }

  unlinkProvider(provider);
}

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
