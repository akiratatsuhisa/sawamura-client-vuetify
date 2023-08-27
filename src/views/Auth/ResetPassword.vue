<template>
  <v-container class="fill-height">
    <v-row class="h-100 align-content-center">
      <v-col class="mx-auto" md="6" lg="4">
        <v-card>
          <v-card-title>{{ translate('title') }}</v-card-title>
          <v-card-subtitle class="text-wrap">
            {{ translate('subtitle') }}
          </v-card-subtitle>
          <v-card-text>
            <form @submit.prevent="onSubmit">
              <v-text-field
                class="mb-3"
                :label="translateFormField('password')"
                v-model="v$.password.$model"
                :error-messages="getErrorMessage(v$.password)"
                @blur="v$.password.$validate"
                clearable
                persistent-hint
                :hint="translateShared('passwordHint')"
                v-bind="bindShowPassword('new')"
              />
              <v-text-field
                class="mb-3"
                :label="translateFormField('confirmPassword')"
                v-model="v$.confirmPassword.$model"
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
                :keypath="pathShared('returnToLogin')"
                tag="span"
                scope="global"
              >
                <router-link
                  class="text-primary"
                  :to="{ name: 'Login', query: { redirectUrl } }"
                >
                  {{ $t('pages.auth.login.title') }}
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
import _ from 'lodash';
import { computed, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import {
  getErrorMessage,
  useAxios,
  usePageLocale,
  useShowPassword,
  useVuelidate,
} from '@/composables';
import { AUTH_REGEX } from '@/constants';
import { IResetPasswordRequest } from '@/interfaces';
import { services } from '@/services';
import { maxLength, minLength, regex, required, sameAs } from '@/validators';

const router = useRouter();
const route = useRoute();
const {
  translate,
  pathShared,
  translateShared,
  pathFormField,
  translateFormField,
} = usePageLocale({
  prefix: 'auth.resetPassword',
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
