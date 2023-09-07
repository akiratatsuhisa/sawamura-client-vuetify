<template>
  <v-container class="fill-height">
    <v-responsive>
      <v-row class="h-100 align-content-center">
        <v-col class="mx-auto" md="6" lg="4">
          <v-card rounded="xl">
            <v-card-title>{{ translate('title') }}</v-card-title>
            <v-card-subtitle class="text-wrap">
              {{ translate('subtitle') }}
            </v-card-subtitle>
            <v-card-text>
              <v-btn
                type="submit"
                :to="{ name: 'Login' }"
                variant="elevated"
                block
                class="mb-3"
              >
                {{ translate('link') }}
              </v-btn>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-responsive>
  </v-container>
</template>

<script lang="ts" setup>
import { usePageLocale } from '@/composables';

const { translate } = usePageLocale({ prefix: 'oauth.error' });
</script>
