<template>
  <template v-if="user?.email">
    <h3 class="text-h5">{{ translateVerifyEmail('title') }}</h3>

    <i18n-t
      :keypath="pathVerifyEmail('subtitle.unverified')"
      tag="span"
      scope="global"
      v-if="!user?.emailConfirmed"
      class="text-subtitle-2 font-weight-light text-high-emphasis"
    >
      <span class="text-primary text-decoration-underline">
        {{ user.email }}
      </span>
    </i18n-t>
    <i18n-t
      :keypath="pathVerifyEmail('subtitle.verified')"
      tag="span"
      scope="global"
      v-else
      class="text-subtitle-2 font-weight-light text-high-emphasis"
    >
      <span class="text-primary text-decoration-underline">
        {{ user.email }}
      </span>
    </i18n-t>

    <div class="d-flex justify-space-between align-center">
      <v-list-item-subtitle>
        <div v-if="!user.emailConfirmed" class="text-error d-flex align-center">
          <v-icon start>mdi-close-circle-outline</v-icon>
          <span>{{ $t('common.verifyStates.unverified') }}</span>
        </div>
        <div v-else class="text-success d-flex align-center">
          <v-icon start>mdi-check-circle-outline</v-icon>
          <span>{{ $t('common.verifyStates.verified') }}</span>
        </div>
      </v-list-item-subtitle>

      <v-btn
        v-if="!user.emailConfirmed"
        :loading="isLoadingVerifyEmail"
        :variant="hasSent ? 'flat' : 'tonal'"
        :disabled="hasSent"
        @click="onSubmitRequestVerifyEmail"
      >
        <template v-if="!hasSent">{{
          translateVerifyEmail('form.submit')
        }}</template>
        <template v-else>
          <v-icon>mdi-cloud-check-outline</v-icon>
        </template>
      </v-btn>
    </div>

    <v-divider class="my-3" />
  </template>

  <template v-if="user?.email">
    <h3 class="text-h5">{{ translateChangeEmail('title') }}</h3>
    <i18n-t
      :keypath="pathChangeEmail('subtitle')"
      tag="span"
      scope="global"
      class="text-subtitle-2 font-weight-light text-high-emphasis"
    >
      <span class="text-primary text-decoration-underline">
        {{ user.email }}
      </span>
    </i18n-t>
  </template>
  <template v-else>
    <h3 class="text-h5">{{ translateConfigureEmail('title') }}</h3>
    <span class="text-subtitle-2 font-weight-light text-high-emphasis">
      {{ translateConfigureEmail('subtitle') }}
    </span>
  </template>

  <form @submit.prevent="onSubmit">
    <v-row no-gutters class="justify-space-between mt-3">
      <v-col cols="12" md="8" lg="6">
        <v-text-field
          class="mb-3"
          :label="
            user?.email
              ? translateChangeEmailFormField('email')
              : translateConfigureEmailFormField('email')
          "
          v-model="v$.email.$model"
          :error-messages="getErrorMessage(v$.email)"
          @blur="v$.email.$validate"
          placeholder="email@example.com"
          persistent-hint
          :hint="translateChangeEmailFormField('email', 'hint')"
        />
      </v-col>
      <v-col cols="12" md="auto">
        <v-divider v-if="$vuetify.display.smAndDown" class="mb-3" />

        <v-btn
          type="submit"
          class="mt-0 mt-md-3"
          variant="flat"
          :loading="isLoadingUpdateEmail || isLoading"
          :block="$vuetify.display.smAndDown"
          :disabled="!submitable"
        >
          {{ translateChangeEmail('form.submit') }}
        </v-btn>
      </v-col>
    </v-row>
  </form>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';

import {
  getErrorMessage,
  useAuth,
  useAxios,
  usePageLocale,
  useVuelidate,
} from '@/composables';
import { IUpdateEmailRequest } from '@/interfaces';
import { services } from '@/services';
import { email, maxLength, required } from '@/validators';

const { path: pathVerifyEmail, translate: translateVerifyEmail } =
  usePageLocale({
    prefix: 'settings.email.verifyEmail',
  });
const {
  path: pathChangeEmail,
  translate: translateChangeEmail,
  pathFormField: pathChangeEmailFormField,
  translateFormField: translateChangeEmailFormField,
} = usePageLocale({
  prefix: 'settings.email.changeEmail',
});
const {
  translate: translateConfigureEmail,
  translateFormField: translateConfigureEmailFormField,
} = usePageLocale({
  prefix: 'settings.email.configureEmail',
});

const { user, fetchAccessToken } = useAuth();

const { excute: requestVerifyEmail, isLoading: isLoadingVerifyEmail } =
  useAxios(services.auth, 'verifyEmail', {
    translateMessage: 'success.verifyEmail',
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
    translateMessage: 'success.updateEmail',
  });

const form = reactive<IUpdateEmailRequest>({
  email: '',
});

const [v$, { handleSubmit, isLoading, submitable }] =
  useVuelidate<IUpdateEmailRequest>(
    {
      email: {
        required: required(pathChangeEmailFormField('email')),
        email: email,
        maxLength: maxLength(pathChangeEmailFormField('email'), 255),
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
