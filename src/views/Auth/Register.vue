<template>
  <v-container class="fill-height">
    <v-row class="h-100 align-content-center">
      <v-col class="mx-auto" md="6" lg="4">
        <v-card ref="formRef">
          <v-card-title>Register</v-card-title>
          <v-card-subtitle class="text-wrap">
            By continuing, you are setting up account and agree to our User
            Agreement and Privacy Policy.
          </v-card-subtitle>
          <v-card-text>
            <form @submit.prevent="onSubmit">
              <v-text-field
                class="mb-3"
                label="Username"
                variant="outlined"
                v-model="v$.username.$model"
                :error-messages="getErrorMessage(v$.username)"
                @blur="v$.username.$validate"
                clearable
              >
              </v-text-field>
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
                Register
              </v-btn>
              <span>
                Already have a account?
                <router-link
                  class="text-primary"
                  :to="{ name: 'Login', query: { redirectUrl } }"
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
import { IRegisterRequest } from '@/interfaces/auth';
import { services } from '@/services';

const router = useRouter();
const route = useRoute();

const redirectUrl = computed(() =>
  _.isArray(route.query.redirectUrl)
    ? _.get(route.query.redirectUrl, '0', '/')
    : route.query.redirectUrl,
);

const showPassword = ref(false);
const showConfirmPassword = ref(false);

const form = reactive<IRegisterRequest & { confirmPassword: string }>({
  username: '',
  password: '',
  confirmPassword: '',
});

const [v$, { handleSubmit }] = useVuelidate<
  IRegisterRequest & { confirmPassword: string }
>(
  {
    username: {
      required: required,
    },
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

const { excute: register, isLoading } = useAxios(services.auth, 'register', {
  unauth: true,
});

const onSubmit = handleSubmit(async (data) => {
  const { username } = await register(data);

  router.push({
    name: 'Login',
    query: { redirectUrl: redirectUrl.value },
    state: { username },
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
