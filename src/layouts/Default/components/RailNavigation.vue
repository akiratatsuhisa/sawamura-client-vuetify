<template>
  <v-navigation-drawer
    permanent
    rail
    rail-width="80"
    touchless
    floating
    class="bg-surface-container text-on-surface"
  >
    <template #prepend>
      <v-list-item
        height="64"
        class="pa-0"
        @click="
          $router.push({
            name: 'Users:Detail',
            params: { username: user?.username },
          })
        "
      >
        <div class="d-flex justify-center">
          <v-avatar
            :image="photoUrl"
            color="secondary-container"
            class="ma-1 elevation-2"
            size="48"
          />
        </div>
      </v-list-item>

      <template v-if="navigationRailFabProps">
        <v-fade-transition>
          <v-floating-action-button
            v-bind="navigationRailFabProps"
            :screen-fab="false"
          />
        </v-fade-transition>
      </template>
    </template>

    <v-list
      class="px-0 py-3"
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
const { mainNavigationItems, navigationRailFabProps } = storeToRefs(appStore);
const { handleNavigationSelect } = appStore;

const { user, photoUrl } = useAuth();
</script>
