import { inject, provide, reactive } from 'vue';

import { KEYS } from '@/constants';

export function initNotification() {
  const queue = reactive<Array<unknown>>([]);

  provide(KEYS.SNACKBAR.QUEUE, queue);
}

export function useNotification() {
  const queue = inject(KEYS.SNACKBAR.QUEUE)!;

  function enqueue() {}

  function dequeue() {}

  return {
    queue,
    enqueue,
    dequeue,
  };
}
