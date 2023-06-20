<template>
  <v-container class="fill-height">
    <v-row class="h-100 align-content-center">
      <v-col class="mx-auto" md="6" lg="4">
        <v-card>
          <v-card-title>Confirm Email</v-card-title>
          <v-card-subtitle class="text-wrap">
            Once you've clicked the
            <span class="text-primary font-weight-bold">confirm</span> button,
            your email address will be confirmed.
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
                Confirm
              </v-btn>

              <div>
                Already confirmed? Return to
                <router-link
                  class="text-primary"
                  :to="{ name: 'Login', query: { redirectUrl } }"
                >
                  Login
                </router-link>
              </div>
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

import { useAxios, useVuelidate } from '@/composables';
import { IConfirmEmailRequest } from '@/interfaces';
import { services } from '@/services';

const router = useRouter();
const route = useRoute();

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
    name: 'Login',
    query: { redirectUrl: redirectUrl.value },
  });
});
</script>
