<template>
  <v-container class="fill-height">
    <v-row>
      <v-col class="mx-auto" md="6" lg="4">
        <v-card class="bg-surface" variant="flat" rounded="xl">
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
                autocomplete="username"
              />

              <v-text-field
                class="mb-3"
                v-model="v$.displayName.$model"
                :label="translateFormField('displayName')"
                :error-messages="getErrorMessage(v$.displayName)"
                @blur="v$.displayName.$validate"
                clearable
                persistent-hint
                autocomplete="displayName"
              />

              <v-text-field
                class="mb-3"
                v-model="v$.email.$model"
                :label="translateFormField('email')"
                :error-messages="getErrorMessage(v$.email)"
                @blur="v$.email.$validate"
                clearable
                autocomplete="email"
              />

              <v-text-field
                class="mb-3"
                v-model="v$.password.$model"
                :label="translateFormField('password')"
                :error-messages="getErrorMessage(v$.password)"
                @blur="v$.password.$validate"
                clearable
                persistent-hint
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
                variant="flat"
                block
                class="mb-3"
                :loading="isLoading"
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
                  :to="{ name: 'Auth:Login', query: { redirectUrl } }"
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
import { Regex } from '@akiratatsuhisa/sawamura-utils';
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
import { IRegisterRequest } from '@/interfaces';
import { services } from '@/services';
import {
  email,
  maxLength,
  minLength,
  regexCustomMessage,
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
  displayName: '',
  password: '',
  confirmPassword: '',
});

const [v$, { handleSubmit }] = useVuelidate<
  IRegisterRequest & { confirmPassword: string }
>(
  {
    username: {
      required: required(pathFormField('username')),
      minLength: minLength(pathFormField('username'), 4),
      maxLength: maxLength(pathFormField('username'), 16),
      regex: regexCustomMessage(
        'username',
        pathFormField('username'),
        Regex.Validate.USERNAME,
      ),
    },
    displayName: {
      required: required(pathFormField('displayName')),
      maxLength: maxLength(pathFormField('displayName'), 64),
    },
    email: { email, maxLength: maxLength(pathFormField('email'), 255) },
    password: {
      required: required(pathFormField('password')),
      minLength: minLength(pathFormField('password'), 8),
      maxLength: maxLength(pathFormField('password'), 64),
      regex: regexCustomMessage(
        'password',
        pathFormField('password'),
        Regex.Validate.PASSWORD,
      ),
    },
    confirmPassword: {
      required: required(pathFormField('confirmPassword')),
      sameAsRef: sameAs(
        pathFormField('confirmPassword'),
        pathFormField('password'),
        computed(() => form.password),
      ),
    },
  },
  form,
);

const { request: requestRegister, isLoading } = useAxios(
  services.auth,
  'register',
  {
    unauth: true,
  },
);

const onSubmit = handleSubmit(async (data) => {
  const { username } = await requestRegister(data);

  router.push({
    name: 'Auth:Login',
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
