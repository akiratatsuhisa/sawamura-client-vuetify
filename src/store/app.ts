import _ from 'lodash';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { RouteLocationNamedRaw, useRoute, useRouter } from 'vue-router';

import { IUseNavigationRailFabProps, useAuth } from '@/composables';
import { INavigationMenuItem } from '@/interfaces';

export const useAppStore = defineStore('app', () => {
  const router = useRouter();
  const route = useRoute();
  const { user } = useAuth();

  const navigationRailFabProps = ref<IUseNavigationRailFabProps>();

  const drawer = ref<boolean>(false);

  const mainNavigationItems = computed(() => {
    const values: Array<INavigationMenuItem> = [
      {
        type: 'navigation',
        key: 'Home',
        value: { name: 'Home' },
        translate: 'menus.home.title',
        icon: 'mdi-home',
        mobile: true,
        onClick() {
          drawer.value = false;
        },
      },
      {
        type: 'navigation',
        key: 'Explore',
        value: { name: 'Explore' },
        translate: 'menus.explore.title',
        icon: 'mdi-magnify',
        mobile: true,
        onClick() {
          drawer.value = false;
        },
      },
      {
        type: 'navigation',
        key: 'Messages',
        value: { name: 'Messages' },
        translate: 'menus.messages.title',
        icon: 'mdi-forum',
        mobile: true,
        onClick() {
          drawer.value = false;
        },
      },
    ];

    if (
      _.some(['Administrator'], (role) => _.includes(user.value?.roles, role))
    ) {
      values.push({
        type: 'navigation',
        key: 'Dashboard',
        value: { name: 'Dashboard' },
        translate: 'menus.dashboard.title',
        icon: 'mdi-view-dashboard',
        mobile: false,
        onClick() {
          drawer.value = true;
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
      });
    }
    return values;
  });

  const subNavigationItems = computed(() => {
    const value = (route.name?.toString() ?? '').split(':').at(0);

    return value
      ? mainNavigationItems.value.find(
          (item) => (item.value as RouteLocationNamedRaw)?.name === value,
        )?.children ?? []
      : [];
  });

  function isNavigationActive(
    item: RouteLocationNamedRaw,
    prefix: boolean = false,
  ) {
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

  function handleNavigationSelect(
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

  return {
    navigationRailFabProps,
    drawer,
    mainNavigationItems,
    subNavigationItems,
    isNavigationActive,
    handleNavigationSelect,
  };
});
