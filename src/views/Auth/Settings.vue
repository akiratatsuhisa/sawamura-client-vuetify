<template>
  <v-main>
    <v-container>
      <v-row>
        <v-col md="12" lg="10" class="mx-auto">
          <v-card>
            <v-toolbar color="surface-variant">
              <v-toolbar-title tag="h1">Settings</v-toolbar-title>
            </v-toolbar>
            <v-divider></v-divider>
            <div
              class="d-flex"
              :class="[isMobile ? 'flex-column' : 'flex-row']"
            >
              <v-tabs
                :model-value="tab"
                @update:model-value="(value: unknown) => changeTab(value as string)"
                :direction="isMobile ? 'horizontal' : 'vertical'"
              >
                <v-tab
                  v-for="(detail, key) in tabs"
                  :key="`tab-${key}`"
                  :value="key"
                  tag="h2"
                >
                  <v-icon start>{{ detail.icon }}</v-icon>
                  {{ detail.title }}
                </v-tab>
              </v-tabs>

              <v-divider :vertical="!isMobile"></v-divider>

              <v-window
                :model-value="tab"
                :direction="isMobile ? 'horizontal' : 'vertical'"
                class="flex-grow-1 flex-shrink-1"
              >
                <v-window-item
                  v-for="(detail, key) in tabs"
                  :key="`window-${key}`"
                  :value="key"
                  class=""
                >
                  <v-sheet class="bg-transparent elevation-0 rounded-0 pa-3">
                    <component v-if="isActiveTab(key)" :is="detail.component" />
                  </v-sheet>
                </v-window-item>
              </v-window>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script lang="ts" setup>
import { useStyleTag } from '@vueuse/core';
import _ from 'lodash';
import { computed, defineAsyncComponent } from 'vue';
import { useDisplay } from 'vuetify';

import { useAuth, useRouterTab } from '@/composables';
import { SettingsTabs } from '@/interfaces';

const display = useDisplay();

const isMobile = computed(() => display.mobile.value);

const { tab, changeTab, isActiveTab } = useRouterTab({
  name: 'Settings',
  param: 'tab',
  defaultTab: 'account',
});

const tabs: SettingsTabs = {
  account: {
    title: 'Account',
    icon: 'mdi-card-account-details-outline',
    component: defineAsyncComponent(
      () => import('@/components/Auth/Settings/AccountInfomation.vue'),
    ),
  },
  display: {
    title: 'Display',
    icon: 'mdi-palette',
    component: defineAsyncComponent(
      () => import('@/components/Auth/Settings/DisplayView.vue'),
    ),
  },
  languages: {
    title: 'Languages',
    icon: 'mdi-translate',
    component: defineAsyncComponent(
      () => import('@/components/Auth/Settings/LanguagesView.vue'),
    ),
  },
  email: {
    title: 'Email',
    icon: 'mdi-email',
    component: defineAsyncComponent(
      () => import('@/components/Auth/Settings/EmailView.vue'),
    ),
  },
  password: {
    title: 'Password',
    icon: 'mdi-form-textbox-password',
    component: defineAsyncComponent(
      () => import('@/components/Auth/Settings/PasswordView.vue'),
    ),
  },
  'oauth-providers': {
    title: 'Oauth Providers',
    icon: 'mdi-link-variant',
    component: defineAsyncComponent(
      () => import('@/components/Auth/Settings/OauthProvider.vue'),
    ),
  },
};

const { user } = useAuth();

useStyleTag(
  computed(() => user.value?.themeStyle ?? ''),
  { id: 'vuetify-auth-profile-style' },
);
</script>
