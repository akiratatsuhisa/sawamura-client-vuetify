import { createSharedComposable } from '@vueuse/core';
import { reactive } from 'vue';

export const useNotification = createSharedComposable(() => {
  const queue = reactive<Array<unknown>>([]);

  function enqueue() {}

  function dequeue() {}

  return {
    queue,
    enqueue,
    dequeue,
  };
});
