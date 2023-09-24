<template>
  <v-app-bar
    :elevation="$vuetify.display.xs && isTopbarElevation ? 2 : 0"
    class="bg-surface-container text-on-surface"
    :image="appBarImage"
  >
    <template #image>
      <v-img
        v-if="$vuetify.display.xs && isTopbarElevation"
        gradient="to top right, rgba(var(--v-theme-surface-container),.5), rgba(var(--v-theme-surface-container),.9)"
      />
    </template>

    <v-app-bar-nav-icon @click="$router.back()">
      <v-icon icon="mdi-arrow-left" />
    </v-app-bar-nav-icon>

    <v-app-bar-title v-if="$vuetify.display.xs && isTopbarElevation">
      <h1 class="v-toolbar-title text-truncate">
        {{ user?.displayName }}
      </h1>
      <h2 class="text-subtitle-2 font-weight-light text-truncate">
        @{{ user?.username }}
      </h2>
    </v-app-bar-title>
    <v-app-bar-title
      v-else
      class="cursor-pointer prevent-select"
      @click="$router.push({ name: 'Home' })"
    >
      {{ $t('common.app.title') }}
    </v-app-bar-title>

    <template v-if="$vuetify.display.mdAndUp">
      <v-messages-menu />
      <v-profile-menu />
    </template>
  </v-app-bar>
</template>

<script lang="ts" setup>
import { useElementSize } from '@vueuse/core';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { useDisplay } from 'vuetify';

import {
  useAuth,
  useBackgroundRoute,
  useScrollBehavior,
  useUserImage,
} from '@/composables';
import VMessagesMenu from '@/layouts/Default/MessagesMenu.vue';
import VProfileMenu from '@/layouts/Default/ProfileMenu.vue';
import { useProfileUserStore } from '@/store';

const route = useBackgroundRoute();
const { user: identityUser } = useAuth();

const profileUserStore = useProfileUserStore();
const { user } = storeToRefs(profileUserStore);

const display = useDisplay();
const { width } = useElementSize(document.body);
const { isTopbarElevation } = useScrollBehavior({
  topbarElevationThreshold: computed(() => (width.value * 9) / 16 - 1),
});

const coverUrl = useUserImage(
  'cover',
  computed(() => {
    if (route.value.params.username === identityUser.value?.username) {
      return identityUser.value!;
    }
    return user.value!;
  }),
);

const appBarImage = computed(() => {
  if (!(display.xs.value && isTopbarElevation.value)) {
    return undefined;
  }
  return coverUrl.value;
});
</script>
