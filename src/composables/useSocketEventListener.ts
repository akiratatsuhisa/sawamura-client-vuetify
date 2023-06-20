import { MaybeRef } from '@vueuse/core';
import _ from 'lodash';
import { Socket } from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';
import { isRef, onBeforeUnmount, readonly, ref, unref, watch } from 'vue';

import { IWsExceptionResponse } from '@/interfaces';

type EmitId = {
  __emit_id__?: string;
};

export type UseSocketEventListenerOptions<D, R, E> = {
  response?: (data: D) => void | Promise<void>;
  listener?: (data: D) => void | Promise<void>;
  exception?: (error: E) => void | Promise<void>;
} & (
  | {
      immediate: true;
      paramsOrData: R;
    }
  | {
      immediate?: false;
    }
);

export function useSocketEventListener<
  WsResponse extends Record<string, any> = Record<string, any>,
  WsRequest extends Record<string, any> = Record<string, any>,
  WsException extends IWsExceptionResponse<WsRequest> = IWsExceptionResponse<WsRequest>,
>(
  socket: MaybeRef<Socket>,
  event: string,
  options?: UseSocketEventListenerOptions<WsResponse, WsRequest, WsException>,
) {
  const { response, exception, listener } = options ?? {};

  const emitId = uuidv4();

  const isLoading = ref<boolean>(false);

  function request(data: WsRequest & EmitId) {
    isLoading.value = true;
    data.__emit_id__ = emitId;
    unref(socket).emit(event, data);
  }

  function isSameEmitId(data: EmitId) {
    return _.isUndefined(data.__emit_id__) || data.__emit_id__ === emitId;
  }

  async function responseCallback(data: WsResponse & EmitId) {
    const isSame = isSameEmitId(data);
    if (!isSame) {
      return;
    }

    await Promise.resolve(response ? response(data) : undefined);
    isLoading.value = false;
  }

  async function exceptionCallback(error: WsException & { data: EmitId }) {
    const isSame = isSameEmitId(error.data);
    if (!isSame) {
      return;
    }

    await Promise.resolve(exception ? exception(error) : undefined);
    isLoading.value = false;
  }

  async function listenerCallback(data: WsResponse) {
    await Promise.resolve(listener ? listener(data) : undefined);
  }

  const listenerEvent = 'listener:' + event;
  const exceptionEvent = 'exception:' + event;

  if (!isRef(socket)) {
    socket.on(event, responseCallback);
    socket.on(exceptionEvent, exceptionCallback);
    socket.on(listenerEvent, listenerCallback);

    onBeforeUnmount(() => {
      socket.off(event, responseCallback);
      socket.off(exceptionEvent, exceptionCallback);
      socket.off(listenerEvent, listenerCallback);
    });
  } else {
    watch(
      () => socket,
      (current, _prev, onCleanup) => {
        current.value.on(event, responseCallback);
        current.value.on(exceptionEvent, exceptionCallback);
        current.value.on(listenerEvent, listenerCallback);

        onCleanup(() => {
          current.value.off(event, responseCallback);
          current.value.off(exceptionEvent, exceptionCallback);
          current.value.off(listenerEvent, listenerCallback);
        });
      },
      {
        immediate: true,
      },
    );
  }

  if (options?.immediate) {
    request(options.paramsOrData);
  }

  return {
    isLoading: readonly(isLoading),
    request,
  };
}
