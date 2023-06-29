import _ from 'lodash';
import { computed, MaybeRef, unref, watch } from 'vue';
import {
  LocationQueryRaw,
  RouteParamsRaw,
  useRoute,
  useRouter,
} from 'vue-router';

export interface IUseRouterTabOptions {
  name: string;
  param: string;
  defaultTab?: string;
  defaultParams?: MaybeRef<RouteParamsRaw>;
}

export function useRouterTab(options: IUseRouterTabOptions) {
  const route = useRoute();
  const router = useRouter();
  const defaultParams = computed(() => unref(options.defaultParams));

  const tab = computed(() => route.params[options.param] as string | undefined);

  function changeTab(
    value?: string,
    args?: { query?: LocationQueryRaw; params?: RouteParamsRaw },
  ) {
    router.push({
      name: options.name,
      params: {
        ...defaultParams.value,
        ...args?.params,
        [options.param]: value,
      },
      query: args?.query,
    });
  }

  function isActiveTab(value?: string) {
    return tab.value === value;
  }

  watch(
    tab,
    (tab) => {
      if (!_.isNil(tab) || tab !== '') {
        return;
      }

      changeTab(options?.defaultTab);
    },
    { immediate: true },
  );

  return { tab, changeTab, isActiveTab };
}

export interface IUseRouterDialogOptions {
  name: string;
  param: string;
  defaultParams?: MaybeRef<RouteParamsRaw>;
}

export function useRouterDialog(options: IUseRouterDialogOptions) {
  const route = useRoute();
  const router = useRouter();
  const defaultParams = computed(() => unref(options.defaultParams));

  const dialog = computed(
    () => route.params[options.param] as string | undefined,
  );

  function openDialog(
    value: string,
    args?: { query?: LocationQueryRaw; params?: RouteParamsRaw },
  ) {
    router.push({
      name: options.name,
      params: {
        ...defaultParams.value,
        ...args?.params,
        [options.param]: value,
      },
      query: args?.query,
    });
  }

  function closeDialog() {
    router.push({
      name: options.name,
      params: { ...defaultParams.value, [options.param]: undefined },
    });
  }

  function isActiveDialog(value?: string): boolean;
  function isActiveDialog(
    callback: (args: {
      query?: LocationQueryRaw;
      params?: RouteParamsRaw;
    }) => boolean,
  ): boolean;
  function isActiveDialog(arg?: any): boolean {
    if (typeof arg === 'function') {
      return arg({ query: route.query, params: route.params });
    }

    return dialog.value === arg;
  }

  return { dialog, openDialog, closeDialog, isActiveDialog };
}
