<template>
  <v-container class="fill-height">
    <v-row class="h-100 align-content-center">
      <v-col class="mx-auto" md="6" lg="4">
        <v-card>
          <v-card-title>{{ translate('title') }}</v-card-title>
          <v-card-subtitle class="text-wrap">
            {{ translate('subtitle') }}
          </v-card-subtitle>
          <v-card-text class="text-center">
            <v-progress-circular
              indeterminate
              color="primary"
              size="80"
              width="8"
            ></v-progress-circular>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { useAuth, usePageLocale } from '@/composables';

const { translate } = usePageLocale({ prefix: 'oauth.callback' });

const route = useRoute();
const router = useRouter();

const { oauthLogin } = useAuth();

onMounted(() => {
  const { accessToken, refreshToken, redirectUrl } = route.query;
  if (typeof accessToken !== 'string' || typeof refreshToken !== 'string') {
    return router.push({ name: 'Oauth:Error' });
  }
  oauthLogin({
    accessToken,
    refreshToken,
  });
  router.push(
    typeof redirectUrl === 'string' && redirectUrl.length
      ? { path: redirectUrl }
      : { name: 'Home' },
  );
});
</script>
