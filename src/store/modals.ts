import { defineStore } from 'pinia';
import { reactive } from 'vue';

export const useModalsStore = defineStore('modals', () => {
  const modalEventsContainer = reactive<{
    [key: string]: {
      onClose?: () => void;
      onSuccess?: (data: any) => void;
      onError?: (error: any) => void;
      onPick?: (data: any) => void;
    };
  }>({});

  return { modalEventsContainer };
});
