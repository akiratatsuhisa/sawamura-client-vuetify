<template>
  <v-container class="fill-height">
    <v-row>
      <v-col class="mx-auto" md="6" lg="4">
        <v-card rounded="xl">
          <v-card-title>{{ translate('title') }}</v-card-title>
          <v-card-subtitle class="text-wrap">
            {{ translate('subtitle') }}
          </v-card-subtitle>
          <v-card-text>
            <form @submit.prevent="onSubmit">
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

import { useAxios, usePageLocale, useVuelidate } from '@/composables';
import { IConfirmEmailRequest } from '@/interfaces';
import { services } from '@/services';

const router = useRouter();
const route = useRoute();
const { translate, pathShared } = usePageLocale({
  prefix: 'auth.confirmEmail',
});

const redirectUrl = computed(() =>
  _.isArray(route.query.redirectUrl)
    ? _.get(route.query.redirectUrl, '0', '/')
    : route.query.redirectUrl,
);

const form = reactive<IConfirmEmailRequest>({
  token:
    (_.isArray(route.query.token)
      ? _.get(route.query.token, '0', undefined)
      : route.query.token) ?? '',
});

const [_v$, { handleSubmit }] = useVuelidate<IConfirmEmailRequest>({}, form);

const { excute: confirmEmail, isLoading } = useAxios(
  services.auth,
  'confirmEmail',
  {
    unauth: true,
  },
);

const onSubmit = handleSubmit(async (data) => {
  await confirmEmail(data);

  router.push({
    name: 'Auth:Login',
    query: { redirectUrl: redirectUrl.value },
  });
});
</script>
