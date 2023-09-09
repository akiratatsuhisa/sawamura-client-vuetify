<template>
  <v-main>
    <v-container>
      <v-row>
        <v-col class="mx-auto" cols="12" md="6">
          <v-card class="text-center" rounded="xl">
            <v-card-text>
              <v-icon icon="mdi-alert-circle" color="error" size="128" />
            </v-card-text>
            <v-card-title tag="h1">
              <span class="text-error">500</span>
              {{ translate('title') }}
            </v-card-title>
            <v-card-subtitle tag="h2">
              {{ translate('subtitle') }}
            </v-card-subtitle>
            <v-card-text>
              <v-btn :to="{ name: 'Home' }">
                {{ translateShared('returnToHome') }}
              </v-btn>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script lang="ts" setup>
import { usePageLocale } from '@/composables';

const { translate, translateShared } = usePageLocale({
  prefix: 'errors.internalServer',
});
</script>
