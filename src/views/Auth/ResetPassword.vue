<template>
  <v-container class="fill-height">
    <v-row class="h-100 align-content-center">
      <v-col class="mx-auto" md="6" lg="4">
        <v-card ref="formRef">
          <v-card-title>Reset Password</v-card-title>
          <v-card-subtitle class="text-wrap">
            Reset your password.
          </v-card-subtitle>
          <v-card-text>
            <form @submit.prevent="onSubmit">
              <v-text-field
                class="mb-3"
                label="Password"
                variant="outlined"
                v-model="v$.password.$model"
                :error-messages="getErrorMessage(v$.password)"
                @blur="v$.password.$validate"
                clearable
                :type="showPassword ? 'text' : 'password'"
                :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append-inner="showPassword = !showPassword"
              >
              </v-text-field>
              <v-text-field
                class="mb-3"
                label="Confirm"
                hint="Re-enter password"
                persistent-hint
                variant="outlined"
                v-model="v$.confirmPassword.$model"
                :error-messages="getErrorMessage(v$.confirmPassword)"
                @blur="v$.confirmPassword.$validate"
                clearable
                :type="showConfirmPassword ? 'text' : 'password'"
                :append-inner-icon="
                  showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'
                "
                @click:append-inner="showConfirmPassword = !showConfirmPassword"
              >
              </v-text-field>

              <v-btn
                type="submit"
                :loading="isLoading"
                variant="elevated"
                block
                class="mb-3"
              >
                Reset
              </v-btn>
              <span>
                Return to
                <router-link class="text-primary" :to="{ name: 'Login' }"
                  >Login</router-link
                >
              </span>
            </form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { required, sameAs } from '@vuelidate/validators';
import { onKeyStroke } from '@vueuse/core';
import _ from 'lodash';
import { computed, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { useAxios } from '@/composables/useAxios';
import { getErrorMessage, useVuelidate } from '@/composables/useVuelidate';
import { IResetPasswordRequest } from '@/interfaces/auth';
import { services } from '@/services';

const router = useRouter();
const route = useRoute();

const showPassword = ref(false);
const showConfirmPassword = ref(false);

const form = reactive<IResetPasswordRequest & { confirmPassword: string }>({
  token:
    (_.isArray(route.query.token)
      ? _.get(route.query.token, '0', undefined)
      : route.query.token) ?? '',
  password: '',
  confirmPassword: '',
});

const [v$, { handleSubmit }] = useVuelidate<
  IResetPasswordRequest & { confirmPassword: string }
>(
  {
    password: {
      required: required,
    },
    confirmPassword: {
      required: required,
      sameAsRef: sameAs(computed(() => form.password)),
    },
  },
  form,
);

const { excute: resetPassword, isLoading } = useAxios(
  services.auth,
  'resetPassword',
  {
    unauth: true,
  },
);

const onSubmit = handleSubmit(async (data) => {
  await resetPassword(data);

  router.push({
    name: 'Login',
  });
});

const formRef = ref();

onKeyStroke(
  'Enter',
  () => {
    onSubmit();
  },
  { target: formRef },
);
</script>
