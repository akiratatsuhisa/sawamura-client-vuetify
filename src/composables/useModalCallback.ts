import _ from 'lodash';

import { useModalsStore } from '@/store';

import { useHistoryState } from './useRouter';

export function useModalCallback<
  TSuccess = any,
  TError = any,
  TPickedData = any,
>() {
  const { modalEventsContainer } = useModalsStore();
  const historyState = useHistoryState();

  function onClose() {
    const key = historyState.value.key;

    if (_.isUndefined(key)) {
      return;
    }

    modalEventsContainer[key].onClose?.();
  }

  function onSuccess(data?: TSuccess) {
    const key = historyState.value.key;

    if (_.isUndefined(key)) {
      return;
    }

    modalEventsContainer[key].onSuccess?.(data);
  }

  function onError(error?: TError) {
    const key = historyState.value.key;

    if (_.isUndefined(key)) {
      return;
    }

    modalEventsContainer[key].onSuccess?.(error);
  }

  function onPick(data?: TPickedData) {
    const key = historyState.value.key;

    if (_.isUndefined(key)) {
      return;
    }

    modalEventsContainer[key].onSuccess?.(data);
  }

  return { onClose, onSuccess, onError, onPick };
}
