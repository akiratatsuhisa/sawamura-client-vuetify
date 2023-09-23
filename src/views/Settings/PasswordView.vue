<template>
  <h3 class="text-h5">{{ translateChangePassword('title') }}</h3>
  <span class="text-subtitle-2 font-weight-light text-high-emphasis">
    {{ translateChangePassword('subtitle') }}
  </span>

  <form @submit.prevent="onSubmit" class="mt-6">
    <input hidden name="username" autocomplete="username" />
    <template v-if="user?.hasPassword">
      <v-row no-gutters>
        <v-col cols="12" md="8" lg="6">
          <v-text-field
            class="mb-3"
            :label="translateChangePasswordFormField('currentPassword')"
            v-model="v$.currentPassword.$model"
            :error-messages="getErrorMessage(v$.currentPassword)"
            @blur="v$.currentPassword.$validate"
            v-bind="bindShowPassword('current')"
          />
        </v-col>
      </v-row>

      <span class="text-body-2">
        <router-link
          class="text-primary"
          :to="{
            name: 'Auth:ForgotPassword',
          }"
        >
          {{ translateChangePassword('forgotPassword') }}
        </router-link>
      </span>
      <v-divider class="mt-3 mb-6" />
    </template>

    <v-row no-gutters>
      <v-col cols="12" md="8" lg="6">
        <v-text-field
          class="mb-3"
          :label="translateChangePasswordFormField('newPassword')"
          v-model="v$.newPassword.$model"
          :error-messages="getErrorMessage(v$.newPassword)"
          @blur="v$.newPassword.$validate"
          clearable
          v-bind="bindShowPassword('new')"
        />

        <v-text-field
          class="mb-3"
          :label="translateChangePasswordFormField('confirmPassword')"
          v-model="v$.confirmPassword.$model"
          :error-messages="getErrorMessage(v$.confirmPassword)"
          @blur="v$.confirmPassword.$validate"
          clearable
          persistent-hint
          :hint="translateChangePasswordFormField('confirmPassword', 'hint')"
          v-bind="bindShowPassword('confirm')"
        />
      </v-col>
    </v-row>
    <v-divider class="mb-3" />
    <v-row no-gutters>
      <v-col cols="12" md="8" lg="6" class="text-right">
        <v-btn
          type="submit"
          variant="flat"
          :loading="isLoadingUpdatePassword || isLoading"
          :block="$vuetify.display.smAndDown"
          :disabled="!submitable"
        >
          {{ translateChangePassword('form.submit') }}
        </v-btn>
      </v-col>
    </v-row>
  </form>
</template>

<script lang="ts" setup>
import { computed, reactive } from 'vue';

import {
  getErrorMessage,
  useAuth,
  useAxios,
  usePageLocale,
  useShowPassword,
  useVuelidate,
} from '@/composables';
import { AUTH_REGEX } from '@/constants';
import { IUpdatePasswordRequest } from '@/interfaces';
import { services } from '@/services';
import { maxLength, minLength, regex, required, sameAs } from '@/validators';

const {
  translate: translateChangePassword,
  pathFormField: pathChangePasswordFormField,
  translateFormField: translateChangePasswordFormField,
} = usePageLocale({
  prefix: 'settings.password.changePassword',
});

const { user, updateTokens } = useAuth();

const { bindShowPassword } = useShowPassword(
  reactive({
    current: false,
    new: false,
    confirm: false,
  }),
);

const form = reactive<IUpdatePasswordRequest & { confirmPassword: string }>({
  currentPassword: null,
  newPassword: '',
  confirmPassword: '',
});

const { excute: requestUpdatePassword, isLoading: isLoadingUpdatePassword } =
  useAxios(services.auth, 'updatePassword', {
    translateMessage: 'success.updatePassword',
  });

const [v$, { handleSubmit, isLoading, submitable }] = useVuelidate<
  IUpdatePasswordRequest & { confirmPassword: string }
>(
  computed(() => ({
    currentPassword: user?.value?.hasPassword
      ? {
          required: required(pathChangePasswordFormField('currentPassword')),
        }
      : {},

    newPassword: {
      required: required(pathChangePasswordFormField('newPassword')),
      minLength: minLength(pathChangePasswordFormField('newPassword'), 8),
      maxLength: maxLength(pathChangePasswordFormField('newPassword'), 64),
      regex: regex(
        pathChangePasswordFormField('newPassword'),
        AUTH_REGEX.PASSWORD,
      ),
    },
    confirmPassword: {
      required: required(pathChangePasswordFormField('confirmPassword')),
      sameAsRef: sameAs(
        pathChangePasswordFormField('newPassword'),
        pathChangePasswordFormField('confirmPassword'),
        computed(() => form.newPassword),
      ),
    },
  })),
  form,
);

const onSubmit = handleSubmit(async (data) => {
  try {
    const result = await requestUpdatePassword(data);
    updateTokens(result);
  } finally {
    form.currentPassword = null;
    form.newPassword = '';
    form.confirmPassword = '';
    v$.value.$reset();
  }
});
</script>
