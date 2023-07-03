import { v4 as uuidv4 } from 'uuid';
import { Component, inject } from 'vue';

import { KEYS } from '@/constants';

export type AlertResult = {
  isCancel: boolean;
  isConfirm: boolean;
  isDeny: boolean;
  formData?: FormData;
};

export type AlertProps = {
  id: string;
  cancelButton?: { show?: boolean; text?: string };
  denyButton?: { show?: boolean; text?: string };
  confirmButton?: { show?: boolean; text?: string };
  message?: string;
  icon?: { name: string; color?: string };
  image?: {
    url: string;
    ratio: number;
    alt?: string;
  };
  comp?: Component;
};

export type AlertOptions = Omit<AlertProps, 'id' | 'message' | 'comp'> &
  (Required<Pick<AlertProps, 'message'>> | Required<Pick<AlertProps, 'comp'>>);

export async function alertFire(
  items: Array<AlertProps>,
  options: AlertOptions,
) {
  const id = uuidv4();

  return new Promise<AlertResult>((resolve) => {
    const item = {
      ...(options as AlertOptions),
      id,
      onSubmit: (result: AlertResult) => {
        items.splice(
          items.findIndex((item) => item.id === id),
          1,
        );
        resolve(result);
      },
    };

    items.push(item);
  });
}

export function useAlert() {
  const items = inject(KEYS.ALERT)!;

  async function fire(options: AlertOptions) {
    return alertFire(items, options);
  }

  return { fire };
}
