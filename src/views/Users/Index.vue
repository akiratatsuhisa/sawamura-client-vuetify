<template>
  <v-main
    :class="[$vuetify.display.xs ? 'bg-surface' : 'bg-surface-container']"
  >
    <div v-if="!data" class="fill-height d-flex align-center justify-center">
      <v-progress-circular size="88" width="6" color="primary" indeterminate />
    </div>
    <v-container v-else fluid class="pa-0 pa-sm-4">
      <div class="d-flex">
        <div class="flex-grow-1 flex-shrink-1">
          <v-source v-if="identityUser?.username === data?.username" />
          <v-target v-else />

          <v-main-content />
        </div>
        <div
          v-if="$vuetify.display.mdAndUp"
          :style="{ width: $vuetify.display.lgAndDown ? '300px' : '450px' }"
          class="flex-grow-0 flex-shrink-0 ml-0 ml-sm-4 ml-lg-12"
        >
          <v-display-last-images />
          <v-recommend-follows />
          <v-trends />
        </div>
      </div>
    </v-container>

    <v-fade-transition>
      <v-floating-action-button
        icon="mdi-pencil-plus-outline"
        :is-fab-show="display.smAndDown.value"
        @click="openModalComposeWhinny"
      />
    </v-fade-transition>
  </v-main>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { computed, defineAsyncComponent, provide, Ref, ref, watch } from 'vue';
import { useDisplay } from 'vuetify';

import {
  useAuth,
  useAxios,
  useBackgroundRoute,
  useNavigationRailFab,
  useRouterModal,
} from '@/composables';
import { KEYS } from '@/constants';
import { IProfileUserResponse } from '@/interfaces';
import { services } from '@/services';
import { useProfileUserStore } from '@/store';
import VMainContent from '@/views/Users/components/MainContent.vue';
import VSource from '@/views/Users/Source.vue';
import VTarget from '@/views/Users/Target.vue';

const VDisplayLastImages = defineAsyncComponent(
  () => import('@/views/Users/components/DisplayLastImages.vue'),
);
const VRecommendFollows = defineAsyncComponent(
  () => import('@/views/Users/components/RecommendFollows.vue'),
);
const VTrends = defineAsyncComponent(
  () => import('@/views/Users/components/Trends.vue'),
);

const profileUserStore = useProfileUserStore();
const { user } = storeToRefs(profileUserStore);

const route = useBackgroundRoute();
const { user: identityUser } = useAuth();

const { excute, data, headers } = useAxios(
  services.profileUsers,
  'searchProfileByUsername',
);

const hasFollowing = ref<boolean>(false);

watch(
  () => route.value.params.username as string,
  async (username, _prev, onCleanup) => {
    if (!username) {
      return;
    }

    const result = await excute({ username });
    hasFollowing.value = headers.value.get('Has-Following') === 'true';
    user.value = result;

    onCleanup(() => {
      user.value = undefined;
    });
  },
  { immediate: true },
);

provide(KEYS.USERS.PAGE.PROFILE_USER, data as Ref<IProfileUserResponse>);
provide(KEYS.USERS.PAGE.HAS_FOLLOWING, hasFollowing);

const { openModal } = useRouterModal();
function openModalComposeWhinny() {
  openModal(
    { name: 'Compose:Whinny' },
    {
      username:
        route.value.params.username !== identityUser.value?.username
          ? route.value.params.username
          : undefined,
    },
  );
}

const display = useDisplay();
useNavigationRailFab(
  computed(() => ({
    isFabShow: display.mdAndUp.value,
    icon: 'mdi-pencil-plus-outline',
    onClick: openModalComposeWhinny,
  })),
);
</script>
