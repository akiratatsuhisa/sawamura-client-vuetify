<template>
  <v-navigation-drawer
    v-model="drawer"
    :permanent="subItems.length > 0 && subDrawer"
    rail
    rail-width="88"
  >
    <template #prepend>
      <v-list-item nav @click="router.push({ name: 'Profile' })">
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
      <v-list-item
        v-for="item in items"
        :key="item.key"
        :value="item.value"
        class="px-0 py-2 rounded-0 v-list-item--rail"
        variant="text"
        :ripple="false"
        :active="isActive(item.value, true)"
        @click="item.onClick"
      >
        <div class="d-flex justify-center flex-column text-center">
          <div class="d-flex justify-center">
            <div
              class="v-list-item--rail-icon d-flex justify-center align-center px-4 py-1 rounded-pill"
              :class="{ 'bg-secondary-container': isActive(item.value, true) }"
            >
              <v-icon :icon="item.icon" size="24" />
            </div>
          </div>

          <span class="text-caption text-on-surface-variant">
            {{ item.value.name }}
          </span>
        </div>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>

  <v-navigation-drawer
    :model-value="subItems.length > 0 && drawer && subDrawer"
    @update:model-value="subDrawer = $event"
    class="rounded-e-xl"
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
        <v-room-menu-item
          v-else-if="item.type === 'room'"
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
import { IRoomMenuItem, IRootMenuItem } from '@/interfaces';
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

<style lang="scss">
.v-list-item--rail {
  & .v-list-item__overlay,
  & .v-list-item__underlay {
    display: none;
  }

  & .v-list-item--rail-icon {
    &:hover {
      background-color: rgba(var(--v-theme-on-surface), 0.1);
    }

    transition: background-color 0.2s ease-out;
  }
}

.v-list-item--drawer {
  & .v-list-item__overlay,
  & .v-list-item__underlay {
    display: none;
  }
}
</style>
