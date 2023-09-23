import { v4 as uuidv4 } from 'uuid';
import { Component, inject } from 'vue';

import { KEYS } from '@/constants';
import { IExceptionResponse } from '@/interfaces';
import i18n from '@/locales';

export type SnackbarProps = {
  id: string;
  content: string | Component;
  isOnce?: boolean;
  color?: string;
  timeout?: string | number;
};

export type SnackbarOptions = Partial<
  Omit<SnackbarProps, 'id' | 'show' | 'content'>
>;

export type SnackbarOptionsWithoutColor = Omit<SnackbarOptions, 'color'>;

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
    options: SnackbarOptions = {},
  ) {
    snackbarShow(items, messageOrComponent, options);
  }

  function createSnackbarSuccess(
    messageOrComponent: string | Component,
    options: SnackbarOptionsWithoutColor = { isOnce: true },
  ) {
    (options as SnackbarOptions).color = 'success';
    createSnackbar(messageOrComponent, options);
  }

  function createSnackbarInfo(
    messageOrComponent: string | Component,
    options: SnackbarOptionsWithoutColor = { isOnce: true },
  ) {
    (options as SnackbarOptions).color = 'info';
    createSnackbar(messageOrComponent, options);
  }

  function createSnackbarWarning(
    messageOrComponent: string | Component,
    options: SnackbarOptionsWithoutColor = { isOnce: true },
  ) {
    (options as SnackbarOptions).color = 'warning';
    createSnackbar(messageOrComponent, options);
  }

  function createSnackbarError(
    messageOrComponent: string | Component,
    options: SnackbarOptionsWithoutColor = { isOnce: true },
  ) {
    (options as SnackbarOptions).color = 'error';
    createSnackbar(messageOrComponent, options);
  }

  function createSnackbarByException(exception: IExceptionResponse) {
    createSnackbar(
      i18n.global.t(
        `common.messages.${exception.message}`,
        exception.params as any,
      ),
      {
        isOnce: true,
        color: exception.message.split('.')[0],
      },
    );
  }

  return {
    createSnackbar,
    createSnackbarSuccess,
    createSnackbarInfo,
    createSnackbarWarning,
    createSnackbarError,
    createSnackbarByException,
    clear,
  };
}
