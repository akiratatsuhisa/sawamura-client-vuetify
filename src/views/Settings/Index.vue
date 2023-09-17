<template>
  <v-main class="bg-surface-container">
    <v-container fluid>
      <v-card class="bg-surface" variant="flat" rounded="xl">
        <v-toolbar class="bg-surface">
          <v-toolbar-title tag="h1">
            {{ translate('title') }}
          </v-toolbar-title>
        </v-toolbar>
        <v-divider />
        <div class="d-flex" :class="[isMobile ? 'flex-column' : 'flex-row']">
          <v-tabs
            :model-value="tab"
            @update:model-value="(value: unknown) => changeTab(value as string)"
            :direction="isMobile ? 'horizontal' : 'vertical'"
            class="mb-lg-5"
          >
            <v-tab
              v-for="(detail, key) in tabs"
              :key="`tab-${key}`"
              :value="key"
              tag="h2"
            >
              <v-icon start>{{ detail.icon }}</v-icon>
              {{ translateShared(`menus.${detail.name}`) }}
            </v-tab>
          </v-tabs>
          <v-divider :vertical="!isMobile" />

          <v-window
            :model-value="tab"
            @update:model-value="(value: unknown) => changeTab(value as string)"
            :direction="isMobile ? 'horizontal' : 'vertical'"
            class="flex-grow-1 flex-shrink-1"
          >
            <v-window-item
              v-for="(detail, key) in tabs"
              :key="`window-${key}`"
              :value="key"
              class=""
            >
              <v-sheet class="bg-transparent pa-3">
                <component v-if="isActiveTab(key)" :is="detail.component" />
              </v-sheet>
            </v-window-item>
          </v-window>
        </div>
      </v-card>
    </v-container>
  </v-main>
</template>

<script lang="ts" setup>
import { useStyleTag } from '@vueuse/core';
import { computed, defineAsyncComponent } from 'vue';
import { useDisplay } from 'vuetify';

import { useAuth, usePageLocale, useRouterTab } from '@/composables';
import { SettingsTabs } from '@/interfaces';

const display = useDisplay();

const isMobile = computed(() => display.smAndDown.value);

const { tab, changeTab, isActiveTab } = useRouterTab({
  name: 'Settings',
  param: 'tab',
  defaultTab: 'account',
});

const tabs: SettingsTabs = {
  account: {
    name: 'account',
    icon: 'mdi-card-account-details-outline',
    component: defineAsyncComponent(
      () => import('@/views/Settings/AccountInfomation.vue'),
    ),
  },
  display: {
    name: 'display',
    icon: 'mdi-palette',
    component: defineAsyncComponent(
      () => import('@/views/Settings/DisplayView.vue'),
    ),
  },
  languages: {
    name: 'languages',
    icon: 'mdi-translate',
    component: defineAsyncComponent(
      () => import('@/views/Settings/LanguagesView.vue'),
    ),
  },
  email: {
    name: 'email',
    icon: 'mdi-email',
    component: defineAsyncComponent(
      () => import('@/views/Settings/EmailView.vue'),
    ),
  },
  password: {
    name: 'password',
    icon: 'mdi-form-textbox-password',
    component: defineAsyncComponent(
      () => import('@/views/Settings/PasswordView.vue'),
    ),
  },
  'oauth-providers': {
    name: 'oauthProviders',
    icon: 'mdi-link-variant',
    component: defineAsyncComponent(
      () => import('@/views/Settings/OauthProvider.vue'),
    ),
  },
};

const { translate, translateShared } = usePageLocale({ prefix: 'settings' });

const { user } = useAuth();

useStyleTag(
  computed(() => user.value?.themeStyle ?? ''),
  { id: 'vuetify-auth-profile-style' },
);
</script>
