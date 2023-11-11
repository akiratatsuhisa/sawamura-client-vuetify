<template>
  <v-main
    :class="[$vuetify.display.xs ? 'bg-surface' : 'bg-surface-container']"
  >
    <div v-if="!data" class="fill-height d-flex align-center justify-center">
      <v-progress-circular size="88" width="6" color="primary" indeterminate />
    </div>
    <v-container v-else fluid class="pa-0 pa-sm-4">
      <div class="d-block d-md-flex">
        <div class="flex-grow-1 flex-shrink-1">
          <v-sheet
            class="profile-page bg-surface"
            variant="flat"
            :rounded="$vuetify.display.xs ? '0' : 'xl'"
          >
            <template v-if="$vuetify.display.smAndUp">
              <v-toolbar class="bg-surface" rounded="xl">
                <v-toolbar-title style="width: 0">
                  <h1 class="v-toolbar-title text-truncate">
                    {{ user?.displayName }}
                  </h1>
                  <h2 class="text-subtitle-2 font-weight-light text-truncate">
                    @{{ user?.username }}
                  </h2>
                </v-toolbar-title>
              </v-toolbar>
              <v-divider />
            </template>

            <v-sheet
              class="position-sticky"
              :color="$vuetify.display.xs ? 'surface' : 'surface-container'"
              style="top: 64px; z-index: 1"
            >
              <v-tabs
                class="bg-surface"
                :class="{ 'rounded-t-xl': threshold > 80 }"
                :model-value="tab"
                @update:model-value="
                  (value: unknown) => changeTab(value as string)
                "
                grow
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
            </v-sheet>

            <v-window
              :model-value="tab"
              @update:model-value="
                (value: unknown) => changeTab(value as string)
              "
              direction="horizontal"
              class="flex-grow-1 flex-shrink-1"
            >
              <v-window-item
                v-for="(detail, key) in tabs"
                :key="`window-${key}`"
                :value="key"
                class=""
              >
                <v-sheet
                  class="bg-transparent rounded-0"
                  :min-height="
                    $vuetify.display.xs ? windowHeight - 114 : undefined
                  "
                >
                  <component v-if="isActiveTab(key)" :is="detail.component" />
                </v-sheet>
              </v-window-item>
            </v-window>
          </v-sheet>
        </div>
        <div
          v-if="$vuetify.display.mdAndUp"
          :style="{ width: $vuetify.display.lgAndDown ? '300px' : '450px' }"
          class="flex-grow-0 flex-shrink-0 ml-0 ml-md-4 ml-lg-12"
        >
          <v-trendings />
        </div>
      </div>
    </v-container>
  </v-main>
</template>

<script lang="ts" setup>
import { useWindowScroll, useWindowSize } from '@vueuse/core';
import { storeToRefs } from 'pinia';
import { computed, h, watch } from 'vue';
import { useRoute } from 'vue-router';

import VTrendings from '@/components/Trendings/Index.vue';
import {
  useAuth,
  useAxios,
  usePageLocale,
  useRouterTab,
  useThemeStyle,
} from '@/composables';
import { ProfileUserRelationshipTabs } from '@/interfaces';
import { services } from '@/services';
import { useProfileUserStore } from '@/store';
import VRelationshipList from '@/views/Users/components/RelationshipList.vue';

const { height: windowHeight } = useWindowSize();
const { y: threshold } = useWindowScroll();

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
    component: h(VRelationshipList, {
      name: 'followersYouFollow',
      type: 'followers-you-follow',
    }),
  },
  followers: {
    name: 'followers',
    icon: 'mdi-account-heart-outline',
    component: h(VRelationshipList, {
      name: 'followers',
      type: 'followers',
    }),
  },
  following: {
    name: 'following',
    icon: 'mdi-account-eye-outline',
    component: h(VRelationshipList, {
      name: 'following',
      type: 'following',
    }),
  },
};

const { translate } = usePageLocale({
  prefix: 'users.relationships',
});

const { user: identityUser } = useAuth();

const { excute, data } = useAxios(
  services.profileUsers,
  'searchProfileByUsername',
);

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

useThemeStyle(computed(() => user.value?.themeStyle));
</script>
