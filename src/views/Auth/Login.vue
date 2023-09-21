<template>
  <v-container class="fill-height">
    <v-row>
      <v-col class="mx-auto" md="6" lg="4">
        <v-card class="bg-surface" variant="flat" rounded="xl">
          <v-card-title>
            {{ translate('title') }}
          </v-card-title>
          <v-card-subtitle class="text-wrap">
            {{ translateShared('privacy') }}
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
                autocomplete="username"
              />
              <v-text-field
                class="mb-3"
                :label="translateFormField('password')"
                v-model="v$.password.$model"
                :error-messages="getErrorMessage(v$.password)"
                @blur="v$.password.$validate"
                clearable
                v-bind="bindShowPassword('current')"
              />

              <i18n-t
                :keypath="path('forgotPassword')"
                tag="span"
                scope="global"
              >
                <template #username>
                  <router-link
                    class="text-primary"
                    :to="{
                      name: 'Auth:ForgotPassword',
                      query: { redirectUrl },
                    }"
                  >
                    {{ translateFormField('username') }}
                  </router-link>
                </template>
                <template #password>
                  <router-link
                    class="text-primary"
                    :to="{
                      name: 'Auth:ForgotPassword',
                      query: { redirectUrl },
                    }"
                  >
                    {{ translateFormField('password') }}
                  </router-link>
                </template>
              </i18n-t>

              <v-btn
                type="submit"
                variant="flat"
                block
                class="mb-3"
                :loading="isLoading"
              >
                {{ translate('form.submit') }}
              </v-btn>
              <i18n-t :keypath="path('newTo.text')" tag="span" scope="global">
                <router-link
                  class="text-primary"
                  :to="{ name: 'Auth:Register', query: { redirectUrl } }"
                >
                  {{ translate('newTo.link') }}
                </router-link>
              </i18n-t>
            </form>
            <div>
              <v-row no-gutters>
                <v-col class="d-flex align-center mr-2">
                  <v-divider />
                </v-col>
                <v-col cols="auto">OR</v-col>
                <v-col class="d-flex align-center ml-2">
                  <v-divider />
                </v-col>
              </v-row>
              <v-btn
                v-for="(detail, provider) in providers"
                :key="provider"
                :loading="isLoading"
                variant="flat"
                color="tertiary"
                block
                class="my-3 btn-social"
                @click="linkProvider(provider)"
              >
                <template #prepend>
                  <v-avatar size="30" color="white">
                    <v-avatar
                      :image="detail.image"
                      size="24"
                      rounded="0"
                    ></v-avatar>
                  </v-avatar>
                </template>
                {{ $t(`common.providers.${detail.name}`) }}
              </v-btn>
            </div>
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
  useAuth,
  useOauth,
  usePageLocale,
  useShowPassword,
  useVuelidate,
} from '@/composables';
import { ILoginRequest } from '@/interfaces';
import { required } from '@/validators';

const route = useRoute();
const router = useRouter();
const { path, translate, translateShared, pathFormField, translateFormField } =
  usePageLocale({
    prefix: 'auth.login',
  });

const redirectUrl = computed(() =>
  _.isArray(route.query.redirectUrl)
    ? _.get(route.query.redirectUrl, '0', '/')
    : route.query.redirectUrl,
);

const { bindShowPassword } = useShowPassword(reactive({ current: false }));

const form = reactive<ILoginRequest>({
  username: history.state.username ?? '',
  password: '',
});

const [v$, { handleSubmit, isLoading }] = useVuelidate<ILoginRequest>(
  {
    username: {
      required: required(pathFormField('username')),
    },
    password: {
      required: required(pathFormField('password')),
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

const { providers, linkProvider } = useOauth();
</script>
