<template>
  <v-navigation-drawer
    :model-value="subNavigationItems.length > 0 && drawer"
    :touchless="!subNavigationItems.length"
    floating
    @update:model-value="drawer = $event"
    class="bg-surface-container text-on-surface rounded-e-xl rounded-e-md-0"
  >
    <template #prepend>
      <v-list-item v-if="$vuetify.display.xs" nav>
        <template v-slot:prepend>
          <v-btn
            variant="text"
            icon="mdi-menu-open"
            @click="drawer = !drawer"
          ></v-btn>
        </template>

        <v-app-bar-title class="text-primary pa-2">
          {{ $t('common.app.title') }}
        </v-app-bar-title>
      </v-list-item>
    </template>

    <v-list class="py-3" nav @click:select="handleNavigationSelect">
      <template v-for="item in subNavigationItems" :key="item.key">
        <v-title-menu-item
          v-if="item.type === 'title'"
          :item="item"
          class="v-list-item--drawer"
          active-class="bg-secondary-container"
        />
        <v-icon-menu-item
          v-else-if="item.type === 'icon'"
          :item="item"
          class="v-list-item--drawer"
          active-class="bg-secondary-container"
        />
        <v-avatar-menu-item
          v-else-if="item.type === 'avatar'"
          :item="item"
          class="v-list-item--drawer"
          active-class="bg-secondary-container"
        />
      </template>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';

import VAvatarMenuItem from '@/layouts/Default/components/AvatarMenuItem.vue';
import VIconMenuItem from '@/layouts/Default/components/IconMenuItem.vue';
import VTitleMenuItem from '@/layouts/Default/components/TitleMenuItem.vue';
import { useAppStore } from '@/store';

const appStore = useAppStore();
const { drawer, subNavigationItems } = storeToRefs(appStore);
const { handleNavigationSelect } = appStore;
</script>

<style lang="scss">
.v-list-item--drawer {
  & .v-list-item__overlay,
  & .v-list-item__underlay {
    display: none;
  }
}
</style>
