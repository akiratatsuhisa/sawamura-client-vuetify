<template>
  <v-navigation-drawer
    :color="`pink-${$vuetify.theme.current.dark ? 'darken' : 'lighten'}-4`"
    rail
    :permanent="subItems.length > 0 && subDrawer"
    floating
    v-model="drawer"
  >
    <v-list-item
      nav
      prepend-avatar="https://randomuser.me/api/portraits/men/85.jpg"
      @click="router.push({ name: 'Profile' })"
    ></v-list-item>

    <v-divider></v-divider>

    <v-list density="compact" nav @click:select="handleSelect($event, true)">
      <v-list-item
        v-for="item in items"
        :key="item.icon"
        rounded="xl"
        :prepend-icon="item.icon"
        :value="item.value"
        :active="isActive(item.value, true)"
        @click="item.handleClick"
      ></v-list-item>
    </v-list>
  </v-navigation-drawer>

  <v-navigation-drawer
    :model-value="subItems.length > 0 && drawer && subDrawer"
    @update:model-value="subDrawer = $event"
  >
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

    <v-list nav @click:select="handleSelect">
      <v-list-item
        v-for="item in subItems"
        :key="item.title"
        rounded="xl"
        :value="item.value"
        :active="isActive(item.value)"
      >
        <v-list-item-title class="px-2">{{ item.title }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts" setup>
import _ from "lodash";
import { computed, inject, ref } from "vue";
import { RouteLocationNamedRaw, useRoute, useRouter } from "vue-router";

import { KEYS } from "@/constants";

type Item = {
  icon: string;
  value: RouteLocationNamedRaw;
  handleClick(): void;
  children?: Array<{
    title: string;
    value: RouteLocationNamedRaw;
  }>;
};

const router = useRouter();
const route = useRoute();

const drawer = inject(KEYS.DRAWER);
const subDrawer = ref<boolean>(false);

const items = ref<Array<Item>>([
  {
    icon: "mdi-home",
    value: { name: "Home" },
    handleClick() {
      subDrawer.value = false;
    },
  },
  {
    icon: "mdi-forum",
    value: { name: "Messages" },
    handleClick() {
      subDrawer.value = true;
    },
    children: [
      {
        title: "General",
        value: { name: "Messages" },
      },
      {
        title: "Room 1",
        value: { name: "Messages:Room", params: { roomId: "1" } },
      },
      {
        title: "Room 2",
        value: { name: "Messages:Room", params: { roomId: "2" } },
      },
    ],
  },
  {
    icon: "mdi-view-dashboard",
    value: { name: "Dashboard" },
    handleClick() {
      subDrawer.value = true;
    },
    children: [
      {
        title: "Users",
        value: { name: "Dashboard:Users" },
      },
      {
        title: "Messages",
        value: { name: "Dashboard:Messages" },
      },
    ],
  },
]);

const subItems = computed(() => {
  const value = (route.name?.toString() ?? "").split(":").at(0);

  return value
    ? items.value.find(
        (item) => (item.value as RouteLocationNamedRaw)?.name === value
      )?.children ?? []
    : [];
});

const handleSelect = (
  event: { id: unknown; value: boolean; path: unknown[] },
  isParent?: boolean
) => {
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
};

const isActive = (item: RouteLocationNamedRaw, prefix: boolean = false) => {
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
};
</script>
