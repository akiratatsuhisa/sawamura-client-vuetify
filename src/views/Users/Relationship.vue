<template>
  <v-main>
    <v-container
      v-if="!data"
      class="fill-height d-flex align-center justify-center"
    >
      <v-progress-circular size="88" width="6" color="primary" indeterminate />
    </v-container>
    <v-container
      v-else
      :fluid="$vuetify.display.mdAndDown"
      class="pa-0 pa-md-4 px-xl-12"
    >
      <v-responsive>
        <div class="d-block d-md-flex">
          <div class="flex-grow-1 flex-shrink-1">
            <v-card
              :rounded="$vuetify.display.smAndDown ? '0' : 'xl'"
              :variant="$vuetify.display.smAndDown ? 'flat' : 'elevated'"
              :class="[
                $vuetify.display.smAndDown
                  ? 'bg-transparent'
                  : 'bg-surface-container-low text-on-surface',
              ]"
            >
              <template v-if="$vuetify.display.mdAndUp">
                <v-toolbar>
                  <v-app-bar-nav-icon
                    @click="
                      $router.replace({
                        name: 'Users:Detail',
                        params: { username: user?.username },
                      })
                    "
                  >
                    <v-icon icon="mdi-arrow-left" />
                  </v-app-bar-nav-icon>

                  <v-toolbar-title style="width: 0">
                    <h1 class="v-toolbar-title text-truncate">
                      {{ user?.displayName }}
                      dasdsdasdsdasdsdasdsdasdsdasdsdasdsdasdsdasdsdasdsdasdsdasdsdasdsdasdsdasdsdasdsdasdsdasdsdasdsdasdsdasdsdasdsdasdsdasdsdasdsdasdsdasdsdasdsdasdsdasdsdasdsdasdsdasdsdasdsdasdsdasdsdasdsdasdsdasdsdasdsdasdsdasdsdasdsdasdsdasdsdasdsdasdsdasdsdasdsdasdsdasdsdasdsdasdsdasds
                    </h1>
                    <h2 class="text-subtitle-2 font-weight-light text-truncate">
                      @{{ user?.username }}
                    </h2>
                  </v-toolbar-title>
                </v-toolbar>
                <v-divider />
              </template>

              <v-tabs
                :model-value="tab"
                fixed-tabs
                @update:model-value="(value: unknown) => changeTab(value as string)"
              >
                <v-tab
                  v-for="(detail, key) in tabs"
                  :key="`tab-${key}`"
                  :value="key"
                  tag="h2"
                  :class="{
                    'd-none':
                      key === 'followers-you-follow' &&
                      identityUser?.username === route.params.username,
                  }"
                >
                  <v-icon start>{{ detail.icon }}</v-icon>
                  {{ translate(`menus.${detail.name}`) }}
                </v-tab>
              </v-tabs>
              <v-divider />

              <v-window
                :model-value="tab"
                direction="horizontal"
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
            </v-card>
          </div>
          <div
            v-if="$vuetify.display.mdAndUp"
            :style="{ width: $vuetify.display.mdAndDown ? '300px' : '450px' }"
            class="flex-grow-0 flex-shrink-0 ml-0 ml-md-4 ml-lg-12 mt-n4"
          >
            <v-trends />
          </div>
        </div>
      </v-responsive>
    </v-container>
  </v-main>
</template>

<script lang="ts" setup>
import { useStyleTag } from '@vueuse/core';
import { storeToRefs } from 'pinia';
import { computed, defineAsyncComponent, watch } from 'vue';
import { useRoute } from 'vue-router';

import { useAuth, useAxios, usePageLocale, useRouterTab } from '@/composables';
import { ProfileUserRelationshipTabs } from '@/interfaces';
import { services } from '@/services';
import { useProfileUserStore } from '@/store';

const VTrends = defineAsyncComponent(
  () => import('@/views/Users/components/Trends.vue'),
);

const profileUserStore = useProfileUserStore();
const { user } = storeToRefs(profileUserStore);

const route = useRoute();

const { tab, changeTab, isActiveTab } = useRouterTab({
  name: 'Users:Detail:Relationship',
  param: 'tab',
  defaultTab: 'followers',
});

const tabs: ProfileUserRelationshipTabs = {
  'followers-you-follow': {
    name: 'followersYouFollow',
    icon: 'mdi-account-filter-outline',
    component: defineAsyncComponent(
      () => import('@/views/Users/FollowersYouFollow.vue'),
    ),
  },
  followers: {
    name: 'followers',
    icon: 'mdi-account-heart-outline',
    component: defineAsyncComponent(
      () => import('@/views/Users/Followers.vue'),
    ),
  },
  following: {
    name: 'following',
    icon: 'mdi-account-eye-outline',
    component: defineAsyncComponent(
      () => import('@/views/Users/Following.vue'),
    ),
  },
};

const { translate } = usePageLocale({
  prefix: 'users.relationship',
});

const { user: identityUser } = useAuth();

const { excute, data } = useAxios(services.users, 'searchProfileByUsername');

watch(
  () => route.params.username as string,
  async (username, _prev, onCleanup) => {
    if (!username) {
      return;
    }

    const result = await excute({ username });
    user.value = result;

    onCleanup(() => {
      user.value = undefined;
    });
  },
  { immediate: true },
);

useStyleTag(
  computed(() => user.value?.themeStyle ?? ''),
  { id: 'vuetify-auth-profile-style' },
);
</script>
