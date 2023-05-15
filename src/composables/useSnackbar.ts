import { createSharedComposable } from '@vueuse/core';
import { v4 as uuidv4 } from 'uuid';
import { Component, readonly, ref } from 'vue';
import { VSnackbar } from 'vuetify/components/VSnackbar';

type SnackbarProps = Pick<
  VSnackbar['$props'],
  | 'absolute'
  | 'location'
  | 'origin'
  | 'transition'
  | 'zIndex'
  | 'eager'
  | 'disabled'
  | 'timeout'
  | 'vertical'
  | 'rounded'
  | 'variant'
  | 'modelValue'
  | 'activatorProps'
  | 'openOnClick'
  | 'openOnHover'
  | 'openOnFocus'
  | 'closeOnContentClick'
  | 'locationStrategy'
  | 'closeOnBack'
  | 'contained'
  | 'multiLine'
  | 'offset'
  | 'height'
  | 'width'
  | 'color'
  | 'maxHeight'
  | 'maxWidth'
  | 'minHeight'
  | 'minWidth'
  | 'position'
  | 'theme'
  | 'contentClass'
  | 'rounded'
  | 'activator'
  | 'closeDelay'
  | 'openDelay'
  | 'openOnClick'
  | 'openOnFocus'
  | 'contentProps'
  | 'attach'
>;

export type Notification = {
  id: string;
  show: boolean;
  content: string | Component;
  isOnce?: boolean;
} & Partial<SnackbarProps>;

export const useSnackbar = createSharedComposable(() => {
  const snackbars = ref<Array<Notification>>([]);

  function clear() {
    snackbars.value = [];
  }

  function remove(id: string) {
    const notification = snackbars.value.find((o) => o.id === id);

    if (!notification) {
      return;
    }

    notification.show = false;

    setTimeout(() => {
      const index = snackbars.value.findIndex((o) => o.id === id);

      if (index !== -1) {
        snackbars.value.splice(index, 1);
      }
    }, 500);
  }

  function create(
    messageOrComponent: string | Component,
    options?: Partial<Omit<Notification, 'id' | 'show' | 'content'>>,
  ) {
    const notification: Notification = {
      content: messageOrComponent,
      ...options,
      id: uuidv4(),
      show: true,
    };

    snackbars.value = snackbars.value.filter((v) => !v.isOnce);

    snackbars.value.push(notification);

    return () => remove(notification.id);
  }

  return {
    snackbars: readonly(snackbars),
    create,
    remove,
    clear,
  };
});
