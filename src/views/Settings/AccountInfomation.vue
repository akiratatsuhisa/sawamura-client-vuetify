<template>
  <h3 class="text-h5">{{ translateAccountInfomation('title') }}</h3>

  <span class="text-subtitle-2 font-weight-light text-high-emphasis">
    {{ translateAccountInfomation('subtitle') }}
  </span>

  <v-divider class="my-3" />

  <h3 class="text-h5">{{ translateDeleteAccount('title') }}</h3>

  <span class="text-subtitle-2 font-weight-light text-high-emphasis">
    {{ translateDeleteAccount('subtitle') }}
  </span>

  <div
    class="d-flex flex-column flex-md-row justify-space-around justify-md-space-between align-stretch align-md-center"
  >
    <v-list-item class="pa-0" lines="three">
      <template #prepend>
        <v-avatar size="64" :image="photoUrl" />
      </template>

      <template #title>{{ user?.displayName }}</template>

      <v-list-item-subtitle>@{{ user?.username }}</v-list-item-subtitle>

      <v-list-item-subtitle class="font-weight-medium">
        {{ fullName }}
      </v-list-item-subtitle>
    </v-list-item>

    <div>
      <v-divider v-if="$vuetify.display.smAndDown" class="my-3" />

      <v-btn
        :loading="isLoading"
        variant="flat"
        color="error"
        :block="$vuetify.display.smAndDown"
        @click="onRequestDeleteAccount"
      >
        {{ translateDeleteAccount('form.submit') }}
      </v-btn>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';

import { useAlert, useAuth, useAxios, usePageLocale } from '@/composables';
import { services } from '@/services';

const { translate: translateAccountInfomation } = usePageLocale({
  prefix: 'settings.account.accountInfomation',
});
const { translate: translateDeleteAccount, makeTranslateAlert } = usePageLocale(
  {
    prefix: 'settings.account.deleteAccount',
  },
);

const router = useRouter();

const { user, fullName, photoUrl, logout } = useAuth();
const { isLoading, request: requestDeleteUser } = useAxios(
  services.auth,
  'deleteAccount',
);

const alert = useAlert();

const translateAlertDeleteAlert = makeTranslateAlert('deleteAlert');
const translateAlertDeleteConfirm = makeTranslateAlert('deleteConfirm');

async function onRequestDeleteAccount() {
  const { isConfirm: isConfirmFirst } = await alert.fire({
    denyButton: { show: true, text: translateAlertDeleteAlert('deny') },
    confirmButton: { show: true, text: translateAlertDeleteAlert('confirm') },
    message: translateAlertDeleteAlert('message'),
  });

  if (!isConfirmFirst) {
    return;
  }

  const { isConfirm: isConfirmSecond } = await alert.fire({
    cancelButton: { show: true, text: translateAlertDeleteConfirm('cancel') },
    confirmButton: { show: true, text: translateAlertDeleteConfirm('confirm') },
    message: translateAlertDeleteConfirm('message'),
  });

  if (!isConfirmSecond) {
    return;
  }

  await requestDeleteUser({});
  await logout();
  router.push({ name: 'Auth:Login' });
}
</script>
