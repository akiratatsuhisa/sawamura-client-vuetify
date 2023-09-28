import { v4 as uuidv4 } from 'uuid';
import { inject, Ref, watch } from 'vue';

import { KEYS } from '@/constants';

export function useLoading(
  ...loadings: Array<Ref<boolean> | Ref<undefined | number>>
) {
  const anyLoading = inject(KEYS.ANY_LOADING)!;
  const loadingPercents = inject(KEYS.LOADING_PERCENTS)!;

  for (const loading of loadings) {
    const uuid = uuidv4();

    if (typeof loading.value === 'boolean') {
      watch(
        loading,
        (loading, _prev, onCleanup) => {
          if (loading) {
            anyLoading.value.add(uuid);
          } else {
            anyLoading.value.delete(uuid);
          }
          onCleanup(() => {
            anyLoading.value.delete(uuid);
          });
        },
        { immediate: true },
      );
    } else {
      watch(
        loading,
        (loading, _prev, onCleanup) => {
          if (typeof loading === 'undefined') {
            loadingPercents.value = loadingPercents.value.filter(
              ([id]) => id !== uuid,
            );
          } else {
            loadingPercents.value.push([uuid, loading]);
          }
          onCleanup(() => {
            loadingPercents.value = loadingPercents.value.filter(
              ([id]) => id !== uuid,
            );
          });
        },
        { immediate: true },
      );
    }
  }
}
