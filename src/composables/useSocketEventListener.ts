import { MaybeRef } from "@vueuse/core";
import _ from "lodash";
import { Socket } from "socket.io-client";
import { isRef, onBeforeUnmount, readonly, ref, unref, watch } from "vue";

import { ExceptionResponse, WsExceptionResponse } from "@/interfaces/error";

export function useSocketEventListener<
  WsResponse extends Record<string, any> | Array<any> = Record<string, any>,
  WsRequest extends Record<string, any> | Array<any> = Record<string, any>,
  WsException extends ExceptionResponse = WsExceptionResponse<WsRequest>
>(
  socket: MaybeRef<Socket>,
  event: string,
  options?: {
    response?: (data: WsResponse) => boolean | void | Promise<boolean | void>;
    listener?: (data: WsResponse) => boolean | void | Promise<boolean | void>;
    exception?: (
      error: WsException
    ) => boolean | void | Promise<boolean | void>;
  }
) {
  const { response, exception, listener } = options ?? {};

  const isLoading = ref<boolean>(false);

  watch(isLoading, (current) => {
    if (current && _.isUndefined(exception)) {
      _.delay(() => (isLoading.value = false), 5000);
    }
  });

  const request = (data: WsRequest) => {
    if (isLoading.value) {
      return;
    }

    isLoading.value = true;
    unref(socket).emit(event, data);

    if (_.isUndefined(response)) {
      isLoading.value = false;
    }
  };

  const responseCallback = response
    ? async (data: WsResponse) => {
        isLoading.value = !((await Promise.resolve(response(data))) ?? true);
      }
    : undefined;

  const exceptionCallback = exception
    ? async (error: WsException) => {
        isLoading.value = !((await Promise.resolve(exception(error))) ?? true);
      }
    : undefined;

  const listenerCallback = listener
    ? async (data: WsResponse) => {
        await Promise.resolve(listener(data));
      }
    : undefined;

  const listenerEvent = "listener:" + event;
  const exceptionEvent = "exception:" + event;

  if (!isRef(socket)) {
    responseCallback && socket.on(event, responseCallback);
    exceptionCallback && socket.on(exceptionEvent, exceptionCallback);
    listenerCallback && socket.on(listenerEvent, listenerCallback);

    onBeforeUnmount(() => {
      responseCallback && socket.off(event, responseCallback);
      exceptionCallback && socket.off(exceptionEvent, exceptionCallback);
      listenerCallback && socket.off(listenerEvent, listenerCallback);
    });
  } else {
    watch(
      () => socket,
      (current, _prev, onCleanup) => {
        responseCallback && current.value.on(event, responseCallback);
        exceptionCallback &&
          current.value.on(exceptionEvent, exceptionCallback);
        listenerCallback && current.value.on(listenerEvent, listenerCallback);

        onCleanup(() => {
          responseCallback && current.value.off(event, responseCallback);
          exceptionCallback &&
            current.value.off(exceptionEvent, exceptionCallback);
          listenerCallback &&
            current.value.off(listenerEvent, listenerCallback);
        });
      },
      {
        immediate: true,
      }
    );
  }

  return {
    isLoading: readonly(isLoading),
    request,
  };
}
