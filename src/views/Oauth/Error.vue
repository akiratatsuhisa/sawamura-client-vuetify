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
            <v-btn
              type="submit"
              variant="flat"
              block
              class="mb-3"
              :to="{ name: 'Auth:Login' }"
            >
              {{ translate('link') }}
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { usePageLocale } from '@/composables';

const { translate } = usePageLocale({ prefix: 'oauth.error' });
</script>
