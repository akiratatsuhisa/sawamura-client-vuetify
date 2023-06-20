<template>
  <v-container class="fill-height">
    <v-row class="h-100 align-content-center">
      <v-col class="mx-auto" md="6" lg="4">
        <v-card>
          <v-card-title>Login</v-card-title>
          <v-card-subtitle class="text-wrap">
            By continuing, you are setting up account and agree to our User
            Agreement and Privacy Policy.
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
              <v-text-field
                class="mb-3"
                label="Password"
                v-model="v$.password.$model"
                :error-messages="getErrorMessage(v$.password)"
                @blur="v$.password.$validate"
                clearable
                :type="showPassword ? 'text' : 'password'"
                :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append-inner="showPassword = !showPassword"
              >
              </v-text-field>
              <span>
                Forget your
                <router-link
                  class="text-primary"
                  :to="{
                    name: 'ForgotPassword',
                    query: { redirectUrl },
                  }"
                >
                  username
                </router-link>
                or
                <router-link
                  class="text-primary"
                  :to="{
                    name: 'ForgotPassword',
                    query: { redirectUrl },
                  }"
                >
                  password
                </router-link>
                ?
              </span>
              <v-btn
                type="submit"
                :loading="isLoading"
                variant="elevated"
                block
                class="my-3"
              >
                Login
              </v-btn>
              <span>
                New to my app?
                <router-link
                  class="text-primary"
                  :to="{ name: 'Register', query: { redirectUrl } }"
                >
                  Register
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
import { computed, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { getErrorMessage, useAuth, useVuelidate } from '@/composables';
import { ILoginRequest } from '@/interfaces';

const router = useRouter();
const route = useRoute();

const redirectUrl = computed(() =>
  _.isArray(route.query.redirectUrl)
    ? _.get(route.query.redirectUrl, '0', '/')
    : route.query.redirectUrl,
);

const showPassword = ref(false);

const form = reactive<ILoginRequest>({
  username: history.state.username ?? '',
  password: '',
});

const [v$, { handleSubmit, isLoading }] = useVuelidate<ILoginRequest>(
  {
    username: {
      required: required,
    },
    password: {
      required: required,
    },
  },
  form,
);

const { login } = useAuth();

const onSubmit = handleSubmit(async (data) => {
  await login(data);

  if (redirectUrl.value) {
    router.push(redirectUrl.value);
  } else {
    router.push({ name: 'Home' });
  }
});
</script>
