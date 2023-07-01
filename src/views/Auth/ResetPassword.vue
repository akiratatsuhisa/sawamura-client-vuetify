<template>
  <v-container class="fill-height">
    <v-row class="h-100 align-content-center">
      <v-col class="mx-auto" md="6" lg="4">
        <v-card>
          <v-card-title>Reset Password</v-card-title>
          <v-card-subtitle class="text-wrap">
            Reset your password.
          </v-card-subtitle>
          <v-card-text>
            <form @submit.prevent="onSubmit">
              <v-text-field
                class="mb-3"
                label="Password"
                v-model="v$.password.$model"
                :error-messages="getErrorMessage(v$.password)"
                @blur="v$.password.$validate"
                clearable
                v-bind="bindShowPassword('new')"
              >
              </v-text-field>
              <v-text-field
                class="mb-3"
                label="Confirm"
                v-model="v$.confirmPassword.$model"
                :error-messages="getErrorMessage(v$.confirmPassword)"
                @blur="v$.confirmPassword.$validate"
                clearable
                persistent-hint
                hint="Re-enter password"
                v-bind="bindShowPassword('confirm')"
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
                <router-link class="text-primary" :to="{ name: 'Login' }">
                  Login
                </router-link>
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
import _ from 'lodash';
import { computed, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import {
  getErrorMessage,
  useAxios,
  useShowPassword,
  useVuelidate,
} from '@/composables';
import { IResetPasswordRequest } from '@/interfaces';
import { services } from '@/services';

const router = useRouter();
const route = useRoute();

const { bindShowPassword } = useShowPassword(
  reactive({
    new: false,
    confirm: false,
  }),
);

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
</script>
