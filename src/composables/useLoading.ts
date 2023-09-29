import { v4 as uuidv4 } from 'uuid';
import { inject, Ref, watch } from 'vue';

import { KEYS } from '@/constants';

export function useLoading(
  ...loadings: Array<Ref<boolean> | Ref<undefined | number>>
) {
  const loadingsContainer = inject(KEYS.LOADINGS)!;

  function clearId(uuid: string) {
    loadingsContainer.value = loadingsContainer.value.filter(
      ([id]) => id !== uuid,
    );
  }

  for (const loading of loadings) {
    const uuid = uuidv4();

    if (typeof loading.value === 'boolean') {
      watch(
        loading,
        (loading, _prev, onCleanup) => {
          if (loading) {
            loadingsContainer.value.push([uuid, loading]);
          } else {
            clearId(uuid);
          }
          onCleanup(() => clearId(uuid));
        },
        { immediate: true },
      );
    } else {
      watch(
        loading,
        (loading, _prev, onCleanup) => {
          if (typeof loading === 'number') {
            loadingsContainer.value.push([uuid, loading]);
          } else {
            clearId(uuid);
          }
          onCleanup(() => clearId(uuid));
        },
        { immediate: true },
      );
    }
  }
}
