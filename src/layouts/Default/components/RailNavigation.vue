<template>
  <v-navigation-drawer
    permanent
    rail
    rail-width="80"
    class="bg-surface-container-low text-on-surface"
  >
    <template #prepend>
      <v-list-item
        nav
        :to="{
          name: 'Users:Detail',
          params: { username: user?.username },
        }"
      >
        <div class="pa-1 d-flex justify-center">
          <v-avatar
            :image="photoUrl"
            color="secondary-container"
            class="elevation-2"
          />
        </div>
      </v-list-item>

      <v-divider />

      <slot name="fab" />
    </template>

    <v-list
      density="compact"
      nav
      @click:select="handleNavigationSelect($event, true)"
    >
      <v-rail-menu-item
        v-for="item in mainNavigationItems"
        :key="item.key"
        :item="item"
        @click="item.onClick"
      />
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';

import { useAuth } from '@/composables';
import VRailMenuItem from '@/layouts/Default/components/RailMenuItem.vue';
import { useAppStore } from '@/store';

const appStore = useAppStore();
const { mainNavigationItems } = storeToRefs(appStore);
const { handleNavigationSelect } = appStore;

const { user, photoUrl } = useAuth();
</script>
