<template>
  <v-app-bar
    :elevation="$vuetify.display.smAndDown && isTopbarElevation ? 4 : 1"
    class="bg-surface-container text-on-surface"
    :image="appBarImage"
  >
    <template v-slot:image>
      <v-img
        v-if="$vuetify.display.smAndDown && isTopbarElevation"
        gradient="to top right, rgba(var(--v-theme-surface-container),.5), rgba(var(--v-theme-surface-container),.9)"
      />
    </template>

    <v-app-bar-nav-icon
      @click="$router.replace($route.meta.backRoute ?? { name: 'Home' })"
    >
      <v-icon icon="mdi-arrow-left" />
    </v-app-bar-nav-icon>

    <v-app-bar-title v-if="$vuetify.display.smAndDown && isTopbarElevation">
      {{ user?.displayName }}
    </v-app-bar-title>
    <v-app-bar-title v-else>
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
import { useRoute } from 'vue-router';
import { useDisplay } from 'vuetify';

import { useAuth, useScrollBehavior, useUserImage } from '@/composables';
import VMessagesMenu from '@/layouts/Default/MessagesMenu.vue';
import VProfileMenu from '@/layouts/Default/ProfileMenu.vue';
import { useProfileUserStore } from '@/store';

const route = useRoute();
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
    if (route.params.username === identityUser.value?.username) {
      return identityUser.value!;
    }
    return user.value!;
  }),
);

const appBarImage = computed(() => {
  if (!(display.smAndDown.value && isTopbarElevation.value)) {
    return undefined;
  }
  return coverUrl.value;
});
</script>
