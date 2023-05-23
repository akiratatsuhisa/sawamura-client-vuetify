<template>
  <v-navigation-drawer
    color="surface-variant"
    rail
    :permanent="subItems.length > 0 && subDrawer"
    v-model="drawer"
  >
    <template #prepend>
      <v-list-item nav @click="router.push({ name: 'Profile' })">
        <template #prepend>
          <v-avatar
            color="secondary-container"
            class="elevation-6"
            :image="photoUrl"
          ></v-avatar>
        </template>
      </v-list-item>

      <v-divider></v-divider>
    </template>

    <v-list density="compact" nav @click:select="handleSelect($event, true)">
      <v-list-item
        v-for="item in items"
        :key="item.key"
        rounded="xl"
        :prepend-icon="item.icon"
        :value="item.value"
        :active="isActive(item.value, true)"
        @click="item.onClick"
      ></v-list-item>
    </v-list>
  </v-navigation-drawer>

  <v-navigation-drawer
    color="surface-variant"
    :model-value="subItems.length > 0 && drawer && subDrawer"
    @update:model-value="subDrawer = $event"
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

      <v-divider></v-divider>
    </template>

    <v-list nav @click:select="handleSelect">
      <template v-for="item in subItems" :key="item.key">
        <v-title-menu-item v-if="item.type === 'title'" :item="item" />
        <v-icon-menu-item v-else-if="item.type === 'icon'" :item="item" />
        <v-avatar-menu-item v-else-if="item.type === 'avatar'" :item="item" />
        <v-room-menu-item v-else-if="item.type === 'room'" :item="item" />
      </template>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts" setup>
import _ from 'lodash';
import { computed, inject, provide, ref } from 'vue';
import { RouteLocationNamedRaw, useRoute, useRouter } from 'vue-router';

import { useAuth } from '@/composables/useAuth';
import { KEYS } from '@/constants';
import { IRoomMenuItem, IRootMenuItem } from '@/interfaces/menus';
import VAvatarMenuItem from '@/layouts/Default/Menus/AvatarMenuItem.vue';
import VIconMenuItem from '@/layouts/Default/Menus/IconMenuItem.vue';
import VRoomMenuItem from '@/layouts/Default/Menus/RoomMenuItem.vue';
import VTitleMenuItem from '@/layouts/Default/Menus/TitleMenuItem.vue';

const { photoUrl } = useAuth();

const router = useRouter();
const route = useRoute();

const darwerRooms = inject(KEYS.DRAWER.ROOMS)!;

const drawer = inject(KEYS.DRAWER.SHOW);
const subDrawer = ref<boolean>(false);

const items = computed<Array<IRootMenuItem>>(() => [
  {
    key: 'Home',
    value: { name: 'Home' },
    icon: 'mdi-home',
    onClick() {
      subDrawer.value = false;
    },
  },
  {
    key: 'Messages',
    value: { name: 'Messages' },
    icon: 'mdi-forum',
    onClick() {
      subDrawer.value = true;
    },
    children: [
      {
        type: 'icon',
        key: 'Messages:List',
        value: { name: 'Messages' },
        icon: 'mdi-forum-outline',
        title: 'Room List',
      },
      ..._.map(
        darwerRooms.value,
        (room) =>
          ({
            type: 'room',
            key: `Messages:Room:${room.id}`,
            value: { name: 'Messages:Room', params: { roomId: room.id } },
            room: room,
          } satisfies IRoomMenuItem),
      ),
    ],
  },
  {
    key: 'Dashboard',
    value: { name: 'Dashboard' },
    icon: 'mdi-view-dashboard',
    onClick() {
      subDrawer.value = true;
    },
    children: [
      {
        type: 'icon',
        key: 'Dashboard:Users',
        value: { name: 'Dashboard:Users' },
        icon: 'mdi-table-account',
        title: 'Users',
      },
      {
        type: 'icon',
        key: 'Dashboard:Messages',
        value: { name: 'Dashboard:Messages' },
        icon: 'mdi-gauge',
        title: 'Messages',
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
</script>
