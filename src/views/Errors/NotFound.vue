<template>
  <v-main class="bg-surface-container">
    <v-container fluid class="fill-height text-center">
      <v-responsive
        class="h-100 pa-3 rounded-lg bg-surface d-flex align-center justify-center"
      >
        <v-icon icon="mdi-help-circle" color="info" size="128" />

        <h1 class="h1">
          <span class="text-info">404</span>
          {{ translate('title') }}
        </h1>

        <h2 class="h2 font-weight-light text-medium-emphasis">
          {{ translate('subtitle') }}
        </h2>

        <v-btn class="mt-3" :to="{ name: 'Home' }">
          {{ translateShared('returnToHome') }}
        </v-btn>
      </v-responsive>
    </v-container>
  </v-main>
</template>

<script lang="ts" setup>
import { usePageLocale } from '@/composables';

const { translate, translateShared } = usePageLocale({
  prefix: 'errors.notFound',
});
</script>
