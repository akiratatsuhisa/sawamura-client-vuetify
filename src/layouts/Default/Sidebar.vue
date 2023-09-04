<template>
  <v-navigation-drawer
    v-model="drawer"
    :permanent="subItems.length > 0 && subDrawer"
    rail
    rail-width="80"
    class="bg-surface-container-low text-on-surface"
  >
    <template #prepend>
      <v-list-item nav @click="gotoUserAuth">
        <div class="pa-1 d-flex justify-center">
          <v-avatar
            :image="photoUrl"
            color="secondary-container"
            class="elevation-2"
          />
        </div>
      </v-list-item>

      <v-divider />
    </template>

    <v-list density="compact" nav @click:select="handleSelect($event, true)">
      <v-rail-menu-item
        v-for="item in items"
        :key="item.key"
        :item="item"
        @click="item.onClick"
      >
      </v-rail-menu-item>
    </v-list>
  </v-navigation-drawer>

  <v-navigation-drawer
    :model-value="subItems.length > 0 && drawer && subDrawer"
    @update:model-value="subDrawer = $event"
    class="bg-surface-container-low text-on-surface rounded-e-xl"
  >
    <template #prepend>
      <v-list-item nav>
        <template v-slot:append>
          <v-btn
            variant="text"
            icon="mdi-chevron-left"
            @click="subDrawer = !subDrawer"
          ></v-btn>
        </template>
      </v-list-item>

      <v-divider />
    </template>

    <v-list nav @click:select="handleSelect">
      <template v-for="item in subItems" :key="item.key">
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
import _ from 'lodash';
import { computed, inject, provide, ref } from 'vue';
import { RouteLocationNamedRaw, useRoute, useRouter } from 'vue-router';

import { useAuth } from '@/composables';
import { KEYS } from '@/constants';
import { IRailMenuItem } from '@/interfaces';
import VAvatarMenuItem from '@/layouts/Default/Menus/AvatarMenuItem.vue';
import VIconMenuItem from '@/layouts/Default/Menus/IconMenuItem.vue';
import VRailMenuItem from '@/layouts/Default/Menus/RailMenuItem.vue';
import VTitleMenuItem from '@/layouts/Default/Menus/TitleMenuItem.vue';

const { user, photoUrl } = useAuth();

const router = useRouter();
const route = useRoute();

const drawer = inject(KEYS.DRAWER.SHOW);
const subDrawer = ref<boolean>(false);

const items = computed<Array<IRailMenuItem>>(() => [
  {
    type: 'rail',
    key: 'Home',
    value: { name: 'Home' },
    translate: 'menus.home.title',
    icon: 'mdi-home',
    onClick() {
      subDrawer.value = false;
    },
  },
  {
    type: 'rail',
    key: 'Messages',
    value: { name: 'Messages' },
    translate: 'menus.messages.title',
    icon: 'mdi-forum',
    onClick() {
      subDrawer.value = true;
    },
  },
  {
    type: 'rail',
    key: 'Dashboard',
    value: { name: 'Dashboard' },
    translate: 'menus.dashboard.title',
    icon: 'mdi-view-dashboard',
    onClick() {
      subDrawer.value = true;
    },
    children: [
      {
        type: 'icon',
        key: 'Dashboard:Users',
        value: { name: 'Dashboard:Users' },
        translate: 'menus.dashboard.subs.users',
        icon: 'mdi-table-account',
      },
      {
        type: 'icon',
        key: 'Dashboard:Messages',
        value: { name: 'Dashboard:Messages' },
        translate: 'menus.dashboard.subs.messages',
        icon: 'mdi-gauge',
      },
    ],
  },
]);

const subItems = computed(() => {
  const value = (route.name?.toString() ?? '').split(':').at(0);

  return value
    ? items.value.find(
        (item) => (item.value as RouteLocationNamedRaw)?.name === value,
      )?.children ?? []
    : [];
});

function handleSelect(
  event: { id: unknown; value: boolean; path: unknown[] },
  isParent?: boolean,
) {
  const { id: routeLocation } = event as { id: RouteLocationNamedRaw };

  if (
    isParent &&
    route.name &&
    routeLocation.name &&
    route.name.toString().length > routeLocation.name.toString().length &&
    route.name.toString().startsWith(routeLocation.name.toString())
  ) {
    return;
  }
  router.push(routeLocation);
}

function isActive(item: RouteLocationNamedRaw, prefix: boolean = false) {
  if (!route.name || !item.name) {
    return false;
  }

  const routeName = route.name.toString();
  const itemName = item.name.toString();

  return prefix
    ? routeName.startsWith(itemName)
    : _.isEmpty(route.params)
    ? routeName === itemName
    : routeName === itemName && _.isEqual(route.params, item.params);
}
provide(KEYS.DRAWER.IS_ACTIVE, isActive);

function gotoUserAuth() {
  router.push({
    name: 'Users:Page',
    params: { username: user.value?.username },
  });
}
</script>
