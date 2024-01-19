import { useWindowScroll } from '@vueuse/core';
import {
  computed,
  MaybeRef,
  onBeforeMount,
  onBeforeUnmount,
  onMounted,
  onUnmounted,
  ref,
  unref,
  watch,
} from 'vue';

export interface UseScrollBehaviorOptions {
  topbarElevationThreshold?: MaybeRef<number>;
  showfabThreshold?: MaybeRef<number>;
  showDetailFabThreshold?: MaybeRef<number>;
}

export function useScrollBehavior(options: UseScrollBehaviorOptions = {}) {
  const { topbarElevationThreshold, showfabThreshold, showDetailFabThreshold } =
    options;

  const { y: threshold } = useWindowScroll();
  const isTopbarElevation = computed(
    () => threshold.value > unref(topbarElevationThreshold ?? 20),
  );
  const isFabShow = computed(
    () => threshold.value > unref(showfabThreshold ?? 100),
  );

  const isFabShowDetail = ref(true);
  watch(threshold, (current, prev) => {
    if (current < unref(showDetailFabThreshold ?? 150)) {
      isFabShowDetail.value = true;
      return;
    }
    isFabShowDetail.value = current < prev;
  });

  return { isTopbarElevation, isFabShow, isFabShowDetail };
}

export function useLifecycleState() {
  const isSetup = ref(true);
  const isMounted = ref(false);
  const isUnMounted = ref(false);

  onBeforeMount(() => {
    isSetup.value = false;
  });

  onMounted(() => {
    isMounted.value = true;
  });

  onBeforeUnmount(() => {
    isMounted.value = false;
  });

  onUnmounted(() => {
    isUnMounted.value = true;
  });

  return { isSetup, isMounted, isUnMounted };
}
