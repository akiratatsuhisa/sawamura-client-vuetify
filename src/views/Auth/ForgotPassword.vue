<template>
  <v-container class="fill-height">
    <v-row class="h-100 align-content-center">
      <v-col class="mx-auto" md="6" lg="4">
        <v-card>
          <v-card-title>Forgot Password</v-card-title>
          <v-card-subtitle class="text-wrap">
            Tell us the username associated with your account, and we'll send
            you an email with a link to reset your password.
          </v-card-subtitle>
          <v-card-text>
            <form @submit.prevent="onSubmit">
              <v-text-field
                class="mb-3"
                label="Username"
                v-model="v$.username.$model"
                :error-messages="getErrorMessage(v$.username)"
                @blur="v$.username.$validate"
                clearable
              >
              </v-text-field>

              <v-btn
                type="submit"
                :loading="isLoading"
                variant="elevated"
                block
                class="mb-3"
              >
                Send
              </v-btn>
              <span>
                Return to
                <router-link
                  class="text-primary"
                  :to="{ name: 'Login', query: { redirectUrl } }"
                >
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
import { required } from '@vuelidate/validators';
import _ from 'lodash';
import { computed, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { getErrorMessage, useAxios, useVuelidate } from '@/composables';
import { IForgotPasswordRequest } from '@/interfaces';
import { services } from '@/services';

const router = useRouter();
const route = useRoute();

const redirectUrl = computed(() =>
  _.isArray(route.query.redirectUrl)
    ? _.get(route.query.redirectUrl, '0', '/')
    : route.query.redirectUrl,
);

const form = reactive<IForgotPasswordRequest>({
  username: '',
});

const [v$, { handleSubmit }] = useVuelidate<IForgotPasswordRequest>(
  {
    username: {
      required: required,
    },
  },
  form,
);

const { excute: forgotPassword, isLoading } = useAxios(
  services.auth,
  'forgotPassword',
  {
    unauth: true,
  },
);

const onSubmit = handleSubmit(async (data) => {
  await forgotPassword(data);

  router.push({
    name: 'Login',
    query: { redirectUrl: redirectUrl.value },
  });
});
</script>
