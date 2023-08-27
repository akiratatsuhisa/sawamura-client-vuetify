import { FunctionArgs, MaybeComputedRef, useThrottleFn } from '@vueuse/core';
import { Ref, ref, watch } from 'vue';

export interface IUseFetchIntersectionOptions {
  isLoading: Ref<boolean>;
  fetch: FunctionArgs;
  ms?: MaybeComputedRef<number>;
  isAllLoaded: Ref<boolean>;
}

export function useFetchIntersection(options: IUseFetchIntersectionOptions) {
  const { isLoading, fetch, ms = 250, isAllLoaded } = options;
  const fetchThrottle = useThrottleFn(fetch, ms);

  const isIntersecting = ref<boolean>(false);

  function onIntersect(
    current: boolean,
    _entries: Array<IntersectionObserverEntry>,
    _observer: IntersectionObserver,
  ) {
    isIntersecting.value = current;
  }

  watch(
    [isIntersecting, isLoading, isAllLoaded],
    ([intersecting, loading, allMessagesLoaded]) => {
      if (intersecting && !loading && !allMessagesLoaded) {
        fetchThrottle();
      }
    },
  );

  return {
    isIntersecting,
    onIntersect,
    fetch,
    fetchThrottle,
  };
}
