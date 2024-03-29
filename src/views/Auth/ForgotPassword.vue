<template>
  <v-container class="fill-height">
    <v-row>
      <v-col class="mx-auto" md="6" lg="4">
        <v-card class="bg-surface" variant="flat" rounded="xl">
          <v-card-title>{{ translate('title') }}</v-card-title>

          <v-card-subtitle class="text-wrap">
            {{ translate('subtitle') }}
          </v-card-subtitle>

          <v-card-text>
            <form @submit.prevent="onSubmit">
              <v-text-field
                class="mb-3"
                :label="translateFormField('username')"
                v-model="v$.username.$model"
                :error-messages="getErrorMessage(v$.username)"
                @blur="v$.username.$validate"
                clearable
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
                :keypath="pathShared('returnToLogin')"
                tag="span"
                scope="global"
              >
                <router-link
                  class="text-primary"
                  :to="{ name: 'Auth:Login', query: { redirectUrl } }"
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
  useVuelidate,
} from '@/composables';
import { IForgotPasswordRequest } from '@/interfaces';
import { services } from '@/services';
import { required } from '@/validators';

const router = useRouter();
const route = useRoute();

const { translate, pathShared, pathFormField, translateFormField } =
  usePageLocale({
    prefix: 'auth.forgotPassword',
  });

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
      required: required(pathFormField('username')),
    },
  },
  form,
);

const { request: requestForgotPassword, isLoading } = useAxios(
  services.auth,
  'forgotPassword',
  {
    unauth: true,
  },
);

const onSubmit = handleSubmit(async (data) => {
  await requestForgotPassword(data);

  router.push({
    name: 'Auth:Login',
    query: { redirectUrl: redirectUrl.value },
  });
});
</script>
