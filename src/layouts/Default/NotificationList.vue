<template>
  <v-menu :close-on-content-click="false">
    <template v-slot:activator="{ props }">
      <v-btn icon v-bind="props">
        <v-avatar
          color="secondary-container"
          class="elevation-6"
          icon="mdi-bell"
        ></v-avatar>
      </v-btn>
    </template>

    <v-card width="300" class="bg-surface-variant text-on-surface-variant">
      <v-list height="350">
        <v-notification-list-item
          v-for="notification in notifications"
          :key="notification.id"
          :item="notification"
          @update="(payload) => requestUpdateNotification(payload)"
          @delete="(payload) => onRequestDeleteNotification(payload)"
        />
      </v-list>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn color="primary" variant="text" @click="fetchMore"> Fetch </v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script lang="ts" setup>
import { useThrottleFn } from '@vueuse/core';
import _ from 'lodash';
import { ref, watch } from 'vue';

import {
  useAlert,
  useSocketEventListener,
  useSocketNotifications,
} from '@/composables';
import {
  IDeleteNotificationRequest,
  INotificationResponse,
  ISearchNotificationRequest,
  IUpdateNotificationRequest,
  NotificationStatus,
} from '@/interfaces';
import VNotificationListItem from '@/layouts/Default/NotificationListItem.vue';

const notifications = ref<Array<INotificationResponse>>([]);

const socket = useSocketNotifications();

const { request: requestNotifications } = useSocketEventListener<
  {
    notifications: Array<INotificationResponse>;
  },
  ISearchNotificationRequest
>(socket, 'list:notification', {
  response({ notifications: data }) {
    notifications.value = _.uniqBy(
      [...notifications.value, ...data],
      (notification) => notification.id,
    );
  },
  immediate: true,
  paramsOrData: { take: 10 },
});

const { request: requestDeleteNotification } = useSocketEventListener<
  INotificationResponse,
  IDeleteNotificationRequest
>(socket, 'delete:notification', {
  response(data) {
    notifications.value = _.filter(
      notifications.value,
      (notification) => notification.id !== data.id,
    );
  },
});

const { request: requestUpdateNotification } = useSocketEventListener<
  INotificationResponse,
  IUpdateNotificationRequest
>(socket, 'update:notification', {
  response(data) {
    const index = _.findIndex(notifications.value, { id: data.id });
    notifications.value.splice(index, 1, data);
  },
});

useSocketEventListener<INotificationResponse>(socket, 'create:notification', {
  response(data) {
    notifications.value = _.uniqBy(
      [data, ...notifications.value],
      (notification) => notification.id,
    );
  },
});

const requestRoomsThrottle = useThrottleFn(requestNotifications, 500);

function fetchMore() {
  const excludeIds = _.map(notifications.value, (room) => room.id);

  requestRoomsThrottle({
    take: 10,
    excludeIds: excludeIds.length ? excludeIds : undefined,
  });
}

watch(
  notifications,
  (current) => {
    _.filter(current, ({ status }) =>
      _.some(
        [NotificationStatus.Queued, NotificationStatus.Sent],
        (s) => status === s,
      ),
    ).forEach(({ id }) =>
      requestUpdateNotification({
        id,
        status: NotificationStatus.Delivered,
      }),
    );
  },
  { immediate: true, deep: true },
);

const alert = useAlert();

async function onRequestDeleteNotification(
  payload: IDeleteNotificationRequest,
) {
  const { isConfirm } = await alert.fire({
    cancelButton: { show: true, text: 'Cancel' },
    confirmButton: { show: true, text: 'Agree' },
    message: 'Do you want to delete this notification?',
  });

  if (!isConfirm) {
    return true;
  }

  requestDeleteNotification(payload);
}
</script>
