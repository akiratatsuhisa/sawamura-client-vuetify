import _ from 'lodash';
import { computed, MaybeRef, Ref, unref, watch } from 'vue';
import {
  LocationQuery,
  LocationQueryRaw,
  RouteLocationNormalizedLoaded,
  RouteParams,
  RouteParamsRaw,
  useRoute,
  useRouter,
} from 'vue-router';

export interface IHistoryStateBackground {
  name: string;
  hash: string;
  params: RouteParams;
  query: LocationQuery;
}

export interface IHistoryState<
  P extends Record<string, any> = Record<string, any>,
> {
  background?: IHistoryStateBackground;
  props: P;
}

export function useHistoryState<P extends Record<string, any>>() {
  const route = useRoute();

  return computed<IHistoryState<P>>(() => {
    // if fullPath channge then update history state
    return route.fullPath && window.history.state;
  });
}

export function useBackgroundRoute() {
  const historyState = useHistoryState();
  const route = useRoute();

  // if declare backgroudRoute then return it else route
  return computed<IHistoryStateBackground>(() => {
    return route.fullPath && (historyState.value.background || (route as any));
  });
}

export function useRouteWithModal(historyState: Ref<IHistoryState>) {
  const router = useRouter();

  // routeWithModal
  return computed(() => {
    // if background declare
    if (historyState.value.background) {
      const { name, hash, params, query } = historyState.value.background;

      return router.resolve({
        name,
        hash,
        params,
        query,
      }) as RouteLocationNormalizedLoaded;
    } else {
      return router.currentRoute.value;
    }
  });
}

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
    router.replace({
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
    router.back();
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

export interface IUseRouterModalOptions {
  keepBackground?: MaybeRef<boolean>;
}

export function useRouterModal<P extends Record<string, any>>(
  options?: IUseRouterModalOptions,
) {
  const { keepBackground } = options ?? {};
  const route = useBackgroundRoute();
  const router = useRouter();
  const historyState = useHistoryState();

  function openModal(
    to: {
      name: string;
      hash?: string;
      params?: RouteParams;
      query?: LocationQuery;
    },
    props?: P,
  ) {
    const route = router.currentRoute.value;

    const background =
      unref(keepBackground) && historyState.value.background
        ? (historyState.value.background as any)
        : {
            name: route.name as string,
            hash: route.hash,
            params: route.params,
            query: route.query,
          };

    router.push({
      ...to,
      state: {
        background,
        props: props ?? {},
      },
    });
  }

  return { route, openModal };
}
