import { createSharedComposable } from '@vueuse/core';
import { v4 as uuidv4 } from 'uuid';
import { Component, reactive, readonly } from 'vue';
import { VSnackbar } from 'vuetify/components/VSnackbar';

export type VSnackbarProps = VSnackbar['$props'];

export type Notification = {
  id: string;
  show: boolean;
  content: string | Component;
  isOnce?: boolean;
  color?: string;
  timeout?: string | number;
} & Record<string, any>;

export type SnackbarBaseOptions = Partial<
  Omit<Notification, 'id' | 'show' | 'content'>
>;

export type SnackbarOptions = Omit<SnackbarBaseOptions, 'color'>;

export const useSnackbar = createSharedComposable(() => {
  const snackbars = reactive<Array<Notification>>([]);

  function clear() {
    snackbars.splice(0, snackbars.length);
  }

  function remove(id: string) {
    const notification = snackbars.find((o) => o.id === id);

    if (!notification) {
      return;
    }

    notification.show = false;

    setTimeout(() => {
      const index = snackbars.findIndex((o) => o.id === id);

      if (index !== -1) {
        snackbars.splice(index, 1);
      }
    }, 500);
  }

  function createSnackbar(
    messageOrComponent: string | Component,
    options: SnackbarBaseOptions = {},
  ) {
    const notification: Notification = {
      content: messageOrComponent,
      ...options,
      id: uuidv4(),
      show: true,
    };

    snackbars.splice(
      0,
      snackbars.length,
      ...snackbars.filter((v) => !v.isOnce),
    );

    snackbars.push(notification);

    return () => remove(notification.id);
  }

  function createSnackbarSuccess(
    messageOrComponent: string | Component,
    options: SnackbarOptions = { isOnce: true },
  ) {
    (options as SnackbarBaseOptions).color = 'success';
    createSnackbar(messageOrComponent, options);
  }

  function createSnackbarInfo(
    messageOrComponent: string | Component,
    options: SnackbarOptions = { isOnce: true },
  ) {
    (options as SnackbarBaseOptions).color = 'info';
    createSnackbar(messageOrComponent, options);
  }

  function createSnackbarWarning(
    messageOrComponent: string | Component,
    options: SnackbarOptions = { isOnce: true },
  ) {
    (options as SnackbarBaseOptions).color = 'warning';
    createSnackbar(messageOrComponent, options);
  }

  function createSnackbarError(
    messageOrComponent: string | Component,
    options: SnackbarOptions = { isOnce: true },
  ) {
    (options as SnackbarBaseOptions).color = 'error';
    createSnackbar(messageOrComponent, options);
  }

  return {
    snackbars: readonly(snackbars),
    createSnackbar,
    createSnackbarSuccess,
    createSnackbarInfo,
    createSnackbarWarning,
    createSnackbarError,
    remove,
    clear,
  };
});
