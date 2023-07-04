<template>
  <h3 class="text-h5">Account Infomation</h3>
  <span class="text-subtitle-2 font-weight-light text-high-emphasis">
    See information about your account, download an archive of your data, or
    learn about your account deactivation options
  </span>

  <v-divider class="my-3"></v-divider>

  <h3 class="text-h5">Delete Account</h3>
  <span class="text-subtitle-2 font-weight-light text-high-emphasis">
    Permanently delete your Sawamura account. Once deleted, the data is not
    recoverable.
  </span>

  <div
    class="d-flex flex-column flex-md-row justify-space-around justify-md-space-between py-2 align-stretch align-md-center"
  >
    <v-list-item class="pa-0">
      <template #prepend>
        <v-avatar size="64" :image="photoUrl" class="elevation-4" />
      </template>
      <template #title>{{ user?.username }}</template>
      <template #subtitle>
        {{ fullName }}
      </template>
    </v-list-item>

    <div>
      <v-divider v-if="$vuetify.display.smAndDown" class="my-3"></v-divider>

      <v-btn
        :loading="isLoading"
        variant="tonal"
        color="error"
        :block="$vuetify.display.smAndDown"
        @click="onRequestDeleteAccount"
      >
        Delete Account
      </v-btn>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';

import { useAlert, useAuth, useAxios } from '@/composables';
import { services } from '@/services';

const router = useRouter();

const { user, fullName, photoUrl, logout } = useAuth();
const { isLoading, excute: requestDeleteUser } = useAxios(
  services.auth,
  'deleteAccount',
);

const alert = useAlert();

async function onRequestDeleteAccount() {
  const { isConfirm: isConfirmFirst } = await alert.fire({
    denyButton: { show: true, text: 'No' },
    confirmButton: { show: true, text: 'Yes' },
    message: 'Are you sure to delete your account?',
  });

  if (!isConfirmFirst) {
    return;
  }

  const { isConfirm: isConfirmSecond } = await alert.fire({
    denyButton: { show: true, text: 'Cancel' },
    confirmButton: { show: true, text: 'Agree' },
    message: 'If you click agree, there is no way to go back!',
  });

  if (!isConfirmSecond) {
    return;
  }

  await requestDeleteUser({});
  await logout();
  router.push({ name: 'Login' });
}
</script>
