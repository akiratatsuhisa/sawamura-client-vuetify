<template>
  <v-container class="fill-height">
    <v-row>
      <v-col class="mx-auto" md="6" lg="4">
        <v-card class="bg-surface" variant="flat" rounded="xl">
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
import { Oauth } from '@/helpers';

const { translate } = usePageLocale({ prefix: 'oauth.callback' });

const route = useRoute();
const router = useRouter();

const { oauthLogin } = useAuth();

onMounted(async () => {
  try {
    await oauthLogin({
      provider: route.params.provider as string,
      params: route.query,
    });
    const { redirectUrl } = Oauth.parseState(route.query.state) ?? {};

    router.replace(
      typeof redirectUrl === 'string' && redirectUrl.length
        ? { path: redirectUrl }
        : { name: 'Home' },
    );
  } catch (error) {
    return router.push({ name: 'Oauth:Error' });
  }
});
</script>
