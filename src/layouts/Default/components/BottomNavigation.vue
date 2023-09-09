<template>
  <v-bottom-navigation
    height="80"
    class="bg-surface-container text-on-surface elevation-4"
  >
    <v-bottom-menu-item
      v-for="item in mainNavigationItems"
      :key="item.key"
      :item="item"
    />
  </v-bottom-navigation>
</template>

<script lang="ts" setup>
import _ from 'lodash';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';

import VBottomMenuItem from '@/layouts/Default/components/BottomMenuItem.vue';
import { useAppStore } from '@/store';

const appStore = useAppStore();
const { mainNavigationItems: items } = storeToRefs(appStore);
const mainNavigationItems = computed(() => _.filter(items.value, 'mobile'));
</script>
