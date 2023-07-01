<template>
  <template v-if="user?.email">
    <h3 class="text-h5">Verify Email</h3>
    <span
      v-if="!user?.emailConfirmed"
      class="text-subtitle-2 font-weight-light text-high-emphasis"
    >
      You should confirm this email
      <span class="text-primary text-decoration-underline">
        {{ user.email }}
      </span>
      to be able to experience all the features fully.
    </span>
    <span v-else class="text-subtitle-2 font-weight-light text-high-emphasis">
      Email:
      <span class="text-primary text-decoration-underline">
        {{ user.email }}
      </span>
    </span>

    <div class="d-flex justify-space-between align-center">
      <v-list-item-subtitle>
        <div v-if="!user.emailConfirmed" class="text-error d-flex align-center">
          <v-icon start>mdi-close-circle-outline</v-icon>
          <span>Unverified</span>
        </div>
        <div v-else class="text-success d-flex align-center">
          <v-icon start>mdi-check-circle-outline</v-icon>
          <span>Verified</span>
        </div>
      </v-list-item-subtitle>

      <v-btn
        v-if="!user.emailConfirmed"
        :loading="isLoadingVerifyEmail"
        :variant="hasSent ? 'flat' : 'tonal'"
        :disabled="hasSent"
        @click="onSubmitRequestVerifyEmail"
      >
        <template v-if="!hasSent">Send</template>
        <template v-else>
          <v-icon>mdi-cloud-check-outline</v-icon>
        </template>
      </v-btn>
    </div>

    <v-divider class="my-3"></v-divider>
  </template>

  <template v-if="user?.email">
    <h3 class="text-h5">Change Email</h3>
    <span class="text-subtitle-2 font-weight-light text-high-emphasis">
      Your current email is
      <span class="text-primary text-decoration-underline">
        {{ user.email }} </span
      >. What would you like to update it to?
    </span>
  </template>
  <template v-else>
    <h3 class="text-h5">Configure Email</h3>
    <span class="text-subtitle-2 font-weight-light text-high-emphasis">
      Your account don't have an email yet. Would you like to configure it?
    </span>
  </template>

  <form @submit.prevent="onSubmit">
    <v-row no-gutters class="justify-space-between mt-3">
      <v-col cols="12" md="8" lg="6">
        <v-text-field
          class="mb-3"
          :label="user?.email ? 'Current' : 'Email'"
          v-model="v$.email.$model"
          :error-messages="getErrorMessage(v$.email)"
          @blur="v$.email.$validate"
          placeholder="email@example.com"
          persistent-hint
          hint="After you update your email address, a verification email will be sent to you."
        />
      </v-col>
      <v-col cols="12" md="auto">
        <v-divider v-if="$vuetify.display.smAndDown" class="mb-3"></v-divider>

        <v-btn
          class="mt-0 mt-md-3"
          type="submit"
          :loading="isLoadingUpdateEmail || isLoading"
          :block="$vuetify.display.smAndDown"
          :disabled="!submitable"
        >
          Submit
        </v-btn>
      </v-col>
    </v-row>
  </form>
</template>

<script lang="ts" setup>
import { email, maxLength, required } from '@vuelidate/validators';
import { reactive, ref } from 'vue';

import {
  getErrorMessage,
  useAuth,
  useAxios,
  useVuelidate,
} from '@/composables';
import { IUpdateEmailRequest } from '@/interfaces';
import { services } from '@/services';

const { user, fetchAccessToken } = useAuth();

const { excute: requestVerifyEmail, isLoading: isLoadingVerifyEmail } =
  useAxios(services.auth, 'verifyEmail', {
    message: 'Verification mail has been sent',
  });

const hasSent = ref(false);

async function onSubmitRequestVerifyEmail() {
  if (hasSent.value) {
    return;
  }

  await requestVerifyEmail({});
  hasSent.value = true;
}

const { excute: requestUpdateEmail, isLoading: isLoadingUpdateEmail } =
  useAxios(services.auth, 'updateEmail', {
    message: 'Email has been changed, a verification mail has been sent',
  });

const form = reactive<IUpdateEmailRequest>({
  email: '',
});

const [v$, { handleSubmit, isLoading, submitable }] =
  useVuelidate<IUpdateEmailRequest>(
    {
      email: {
        required: required,
        email: email,
        maxLength: maxLength(255),
      },
    },
    form,
  );

const onSubmit = handleSubmit(async (data) => {
  await requestUpdateEmail(data);
  form.email = '';
  v$.value.$reset();
  await fetchAccessToken();
});
</script>
