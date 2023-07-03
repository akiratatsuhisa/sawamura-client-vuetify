import { v4 as uuidv4 } from 'uuid';
import { Component, inject } from 'vue';
import { VSnackbar } from 'vuetify/components/VSnackbar';

import { KEYS } from '@/constants';

export type VSnackbarProps = VSnackbar['$props'];

export type SnackbarProps = {
  id: string;
  content: string | Component;
  isOnce?: boolean;
  color?: string;
  timeout?: string | number;
};

export type SnackbarBaseOptions = Partial<
  Omit<SnackbarProps, 'id' | 'show' | 'content'>
>;

export type SnackbarOptions = Omit<SnackbarBaseOptions, 'color'>;

export function snackbarShow(
  items: Array<SnackbarProps>,
  messageOrComponent: string | Component,
  options: SnackbarOptions = {},
) {
  const id = uuidv4();

  function remove() {
    const index = items.findIndex((item) => item.id === id);

    if (index !== -1) {
      items.splice(index, 1);
    }
  }

  const notification = {
    content: messageOrComponent,
    ...options,
    onClose: remove,
    id,
  };

  items.splice(0, items.length, ...items.filter((item) => !item.isOnce));

  items.push(notification);

  return () => remove();
}

export function useSnackbar() {
  const items = inject(KEYS.SNACKBARS)!;

  function clear() {
    items.splice(0, items.length);
  }

  function createSnackbar(
    messageOrComponent: string | Component,
    options: SnackbarBaseOptions = {},
  ) {
    snackbarShow(items, messageOrComponent, options);
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
    createSnackbar,
    createSnackbarSuccess,
    createSnackbarInfo,
    createSnackbarWarning,
    createSnackbarError,
    clear,
  };
}
