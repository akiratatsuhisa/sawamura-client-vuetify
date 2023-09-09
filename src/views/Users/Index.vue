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
      <div class="d-flex">
        <div class="flex-grow-1 flex-shrink-1">
          <v-source v-if="identityUser?.username === data?.username" />
          <v-target v-else />

          <v-main-content />
        </div>
        <div
          v-if="$vuetify.display.mdAndUp"
          :style="{ width: $vuetify.display.mdAndDown ? '300px' : '450px' }"
          class="flex-grow-0 flex-shrink-0 ml-0 ml-md-4 ml-lg-12"
        >
          <v-display-last-images />
          <v-recommend-follows />
          <v-trends />
        </div>
      </div>
    </v-container>
  </v-main>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { defineAsyncComponent, provide, Ref, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

import { useAuth, useAxios } from '@/composables';
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

const route = useRoute();
const { user: identityUser } = useAuth();

const { excute, data, headers } = useAxios(
  services.users,
  'searchProfileByUsername',
);

const hasFollowing = ref<boolean>(false);

watch(
  () => route.params.username as string,
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
</script>
