import { Socket } from "socket.io-client";
import { inject, onBeforeUnmount, onMounted, provide, ref } from "vue";

import { KEYS } from "@/constants";

import { useAuth } from "./useAuth";

export function initSocketChat() {
  const manager = inject(KEYS.MANAGER_SOCKETS)!;

  const { getAccessTokenSilently } = useAuth();

  const socket = ref<Socket>(manager.socket("/chat"));

  provide(KEYS.SOCKET_CHAT, socket);

  function connect() {
    console.debug(`client(${socket.value.id}) connected`);
  }

  function disconnect() {
    console.debug(`client(${socket.value.id}) disconnected`);
  }

  async function authenticate() {
    console.debug("on authenticate");
    const token = await getAccessTokenSilently({ throw: false });
    socket.value.emit("authenticate", token);
  }

  onMounted(async () => {
    manager.opts.autoConnect = false;
    manager.opts.extraHeaders = {
      authorization: `Bearer ${await getAccessTokenSilently({ throw: false })}`,
    };
    socket.value.connect();

    socket.value.on("connect", connect);
    socket.value.on("disconnect", disconnect);
    socket.value.on("authenticate", authenticate);
  });

  onBeforeUnmount(async () => {
    socket.value.off("connect", connect);
    socket.value.off("disconnect", disconnect);
    socket.value.off("authenticate", authenticate);
  });
}

export function useSocketChat() {
  const socket = inject(KEYS.SOCKET_CHAT);

  if (!socket) {
    throw new Error("Socket chat has not been initialized");
  }

  return socket;
}
