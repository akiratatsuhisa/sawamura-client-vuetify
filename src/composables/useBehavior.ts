import { useWindowScroll } from '@vueuse/core';
import { computed, MaybeRef, ref, unref, watch } from 'vue';

export interface UseScrollBehaviorOptions {
  topbarElevationThreshold?: MaybeRef<number>;
  showfabThreshold?: MaybeRef<number>;
  showDetailFabThreshold?: MaybeRef<number>;
}

export function useScrollBehavior(options?: UseScrollBehaviorOptions) {
  const { y: threshold } = useWindowScroll();
  const isTopbarElevation = computed(
    () => threshold.value > unref(options?.topbarElevationThreshold ?? 20),
  );
  const isFabShow = computed(
    () => threshold.value > unref(options?.showfabThreshold ?? 100),
  );

  const isFabShowDetail = ref(true);
  watch(threshold, (current, prev) => {
    if (current < unref(options?.showfabThreshold ?? 150)) {
      isFabShowDetail.value = true;
      return;
    }
    isFabShowDetail.value = current < prev;
  });

  return { isTopbarElevation, isFabShow, isFabShowDetail };
}
