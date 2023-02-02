<template>
  <v-sheet class="wrapper flex-grow-1 flex-shrink-1" min-height="320">
    <v-sheet class="content overflow-y-auto d-flex flex-column-reverse pa-2">
      <!-- messages -->
      <div
        v-for="(message, index) in messages"
        :key="message.id"
        class="d-flex flex-nowrap mt-2"
        :class="[
          message.user.id === identityId ? 'flex-row-reverse' : 'flex-row',
        ]"
      >
        <v-avatar
          class="align-self-end"
          size="28"
          :image="`https://i.pravatar.cc/150?img=${index}`"
        >
        </v-avatar>

        <div class="px-2 flex-shrink-1">
          <v-card rounded="xl">
            <v-card-text v-if="message.type === 'Text'">
              {{ message.content }}
            </v-card-text>
            <v-card-text v-else class="text-grey-lighten-1">
              Message has been deleted
            </v-card-text>
          </v-card>
        </div>

        <v-menu v-if="message.type !== 'None'">
          <template v-slot:activator="{ props }">
            <v-btn
              class="align-self-center"
              icon="mdi-dots-vertical"
              variant="plain"
              size="x-small"
              v-bind="props"
              :loading="isLoadingDeleteMessage"
            ></v-btn>
          </template>
          <v-list>
            <v-list-item
              append-icon="mdi-trash-can-outline"
              title="Delete"
              @click="removeMessage(message.id)"
            />
          </v-list>
        </v-menu>

        <div class="w-25"></div>
      </div>

      <v-sheet class="text-center">
        <v-btn
          variant="plain"
          icon="mdi-arrow-up"
          @click="fetchMoreMessages"
          :loading="isLoading"
        ></v-btn>
      </v-sheet>
    </v-sheet>
  </v-sheet>

  <v-divider></v-divider>

  <v-card variant="flat" rounded="0">
    <v-card-text>
      <v-text-field
        v-model="messageInput"
        variant="outlined"
        density="compact"
        placeholder="Aa"
        append-icon="mdi-send"
        @click:append="sendMessage"
        @keypress.enter="sendMessage"
        hide-details
      ></v-text-field>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import _ from "lodash";
import { computed, inject, ref, watch } from "vue";
import { useRoute } from "vue-router";

import { useAuth } from "@/composables/useAuth";
import { useChat } from "@/composables/useChat";
import { useSocketEventListener } from "@/composables/useSocketEventListener";
import { KEYS } from "@/constants";
import {
  ICreateRoomMessageRequest,
  IDeleteRoomMessageRequest,
  IRoomMessageResponse,
  ISearchRoomMessagesRequest,
} from "@/interfaces/rooms";

const { identityId } = useAuth();
const socket = useChat();

const route = useRoute();
const roomId = computed<string>(() => route.params.roomId as string);
const room = inject(KEYS.CHAT.ROOM)!;

const messages = ref<Array<IRoomMessageResponse>>([]);

const { request: requestMessages, isLoading } = useSocketEventListener<
  Array<IRoomMessageResponse>,
  ISearchRoomMessagesRequest
>(socket, "list:message", {
  response(data) {
    messages.value = _.uniqBy(
      [...messages.value, ...data],
      (message) => message.id
    );
  },
  exception(error) {
    console.error(error);
  },
});

function fetchMoreMessages() {
  requestMessages({
    roomId: roomId.value,
    take: 10,
    cursor: messages.value.at(-1)?.id,
  });
}

watch(
  roomId,
  (roomId) => {
    messages.value = [];
    requestMessages({
      roomId,
      take: 10,
    });
  },
  { immediate: true }
);

function unshiftMessage(data: IRoomMessageResponse): boolean {
  if (data.room.id !== room.value?.id) {
    return false;
  }

  messages.value = _.uniqBy([data, ...messages.value], (message) => message.id);
  return true;
}

const messageInput = ref("");

const { request: requestCreateMessage, isLoading: isLoadingCreateMessage } =
  useSocketEventListener<IRoomMessageResponse, ICreateRoomMessageRequest>(
    socket,
    "create:message",
    {
      response: unshiftMessage,
      listener: unshiftMessage,
      exception(error) {
        if (error.data.roomId !== room.value?.id) {
          return false;
        }

        console.error(error);
      },
    }
  );

function sendMessage() {
  if (!messageInput.value || isLoadingCreateMessage.value) {
    return;
  }
  requestCreateMessage({
    roomId: roomId.value,
    type: "Text",
    content: messageInput.value,
  });

  messageInput.value = "";
}

function updateRemoveMessage(data: IRoomMessageResponse): boolean {
  if (data.room.id !== room.value?.id) {
    return false;
  }

  const index = _.findIndex(
    messages.value,
    (message) => message.id === data.id
  );

  if (index < 0) {
    return false;
  }
  messages.value.splice(index, 1, data);
  return true;
}

const { request: requestDeleteMessage, isLoading: isLoadingDeleteMessage } =
  useSocketEventListener<IRoomMessageResponse, IDeleteRoomMessageRequest>(
    socket,
    "delete:message",
    {
      response: updateRemoveMessage,
      listener: updateRemoveMessage,
      exception(error) {
        if (error.data.roomId !== room.value?.id) {
          return false;
        }

        console.error(error);
      },
    }
  );

function removeMessage(id: string) {
  requestDeleteMessage({
    id,
    roomId: roomId.value,
  });
}
</script>

<style lang="scss" scoped>
.wrapper {
  position: relative;

  .content {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
  }
}
</style>
