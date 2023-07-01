<template>
  <h3 class="text-h5">Change Password</h3>
  <span class="text-subtitle-2 font-weight-light text-high-emphasis">
    Changing your password will log you out of all your active Sawamura sessions
    except the one you’re using at this time.
  </span>

  <form @submit.prevent="onSubmit" class="mt-6">
    <template v-if="user?.hasPassword">
      <v-row no-gutters>
        <v-col cols="12" md="8" lg="6">
          <v-text-field
            class="mb-3"
            label="Current Password"
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
            name: 'ForgotPassword',
          }"
        >
          Forget password?
        </router-link>
      </span>
      <v-divider class="mt-3 mb-6"></v-divider>
    </template>

    <v-row no-gutters>
      <v-col cols="12" md="8" lg="6">
        <v-text-field
          class="mb-3"
          label="New Password"
          v-model="v$.newPassword.$model"
          :error-messages="getErrorMessage(v$.newPassword)"
          @blur="v$.newPassword.$validate"
          clearable
          v-bind="bindShowPassword('new')"
        />

        <v-text-field
          class="mb-3"
          label="Confirm Password"
          v-model="v$.confirmPassword.$model"
          :error-messages="getErrorMessage(v$.confirmPassword)"
          @blur="v$.confirmPassword.$validate"
          clearable
          persistent-hint
          hint="Re-enter password"
          v-bind="bindShowPassword('confirm')"
        />
      </v-col>
    </v-row>
    <v-divider class="mb-3"></v-divider>
    <v-row no-gutters>
      <v-col cols="12" md="8" lg="6" class="text-right">
        <v-btn
          :loading="isLoadingUpdatePassword || isLoading"
          type="submit"
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
import { maxLength, required, sameAs } from '@vuelidate/validators';
import { computed, reactive } from 'vue';

import {
  getErrorMessage,
  useAuth,
  useAxios,
  useShowPassword,
  useVuelidate,
} from '@/composables';
import { IUpdatePasswordRequest } from '@/interfaces';
import { services } from '@/services';

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
    message: 'Password has been changed',
  });

const [v$, { handleSubmit, isLoading, submitable }] = useVuelidate<
  IUpdatePasswordRequest & { confirmPassword: string }
>(
  computed(() => ({
    currentPassword: user?.value?.hasPassword
      ? {
          required: required,
          maxLength: maxLength(64),
        }
      : {},
    newPassword: {
      required: required,
      maxLength: maxLength(64),
    },
    confirmPassword: {
      required: required,
      sameAs: sameAs(computed(() => form.newPassword)),
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
