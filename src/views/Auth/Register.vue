<template>
  <v-container class="fill-height">
    <v-row class="h-100 align-content-center">
      <v-col class="mx-auto" md="6" lg="4">
        <v-card rounded="xl">
          <v-card-title>{{ translate('title') }}</v-card-title>
          <v-card-subtitle class="text-wrap">
            {{ translateShared('privacy') }}
          </v-card-subtitle>
          <v-card-text>
            <form @submit.prevent="onSubmit">
              <v-text-field
                class="mb-3"
                v-model="v$.username.$model"
                :label="translateFormField('username')"
                :error-messages="getErrorMessage(v$.username)"
                @blur="v$.username.$validate"
                clearable
                persistent-hint
                :hint="translateShared('usernameHint')"
              />
              <v-text-field
                class="mb-3"
                v-model="v$.email.$model"
                :label="translateFormField('email')"
                :error-messages="getErrorMessage(v$.email)"
                @blur="v$.email.$validate"
                clearable
              />
              <v-text-field
                class="mb-3"
                v-model="v$.password.$model"
                :label="translateFormField('password')"
                :error-messages="getErrorMessage(v$.password)"
                @blur="v$.password.$validate"
                clearable
                persistent-hint
                :hint="translateShared('passwordHint')"
                v-bind="bindShowPassword('new')"
              />
              <v-text-field
                class="mb-3"
                v-model="v$.confirmPassword.$model"
                :label="translateFormField('confirmPassword')"
                :error-messages="getErrorMessage(v$.confirmPassword)"
                @blur="v$.confirmPassword.$validate"
                clearable
                persistent-hint
                :hint="translateFormField('confirmPassword', 'hint')"
                v-bind="bindShowPassword('confirm')"
              />

              <v-btn
                type="submit"
                :loading="isLoading"
                variant="elevated"
                block
                class="mb-3"
              >
                {{ translate('form.submit') }}
              </v-btn>

              <i18n-t
                :keypath="path('hadAccount.text')"
                tag="span"
                scope="global"
              >
                <router-link
                  class="text-primary"
                  :to="{ name: 'Login', query: { redirectUrl } }"
                >
                  {{ translate('hadAccount.link') }}
                </router-link>
              </i18n-t>
            </form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { onKeyStroke } from '@vueuse/core';
import _ from 'lodash';
import { computed, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import {
  getErrorMessage,
  useAxios,
  usePageLocale,
  useShowPassword,
  useVuelidate,
} from '@/composables';
import { AUTH_REGEX } from '@/constants';
import { IRegisterRequest } from '@/interfaces';
import { services } from '@/services';
import {
  email,
  maxLength,
  minLength,
  regex,
  required,
  sameAs,
} from '@/validators';

const router = useRouter();
const route = useRoute();
const { path, translate, translateShared, pathFormField, translateFormField } =
  usePageLocale({
    prefix: 'auth.register',
  });

const redirectUrl = computed(() =>
  _.isArray(route.query.redirectUrl)
    ? _.get(route.query.redirectUrl, '0', '/')
    : route.query.redirectUrl,
);

const { bindShowPassword } = useShowPassword(
  reactive({
    new: false,
    confirm: false,
  }),
);

const form = reactive<IRegisterRequest & { confirmPassword: string }>({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
});

const [v$, { handleSubmit }] = useVuelidate<
  IRegisterRequest & { confirmPassword: string }
>(
  {
    username: {
      required: required(pathFormField('username')),
      minLength: minLength(pathFormField('username'), 3),
      maxLength: maxLength(pathFormField('username'), 255),
      regex: regex(pathFormField('username'), AUTH_REGEX.USERNAME),
    },
    email: { email, maxLength: maxLength(pathFormField('email'), 255) },
    password: {
      required: required(pathFormField('password')),
      minLength: minLength(pathFormField('password'), 8),
      maxLength: maxLength(pathFormField('password'), 64),
      regex: regex(pathFormField('password'), AUTH_REGEX.PASSWORD),
    },
    confirmPassword: {
      required: required(pathFormField('confirmPassword')),
      sameAsRef: sameAs(
        pathFormField('password'),
        pathFormField('confirmPassword'),
        computed(() => form.password),
      ),
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
