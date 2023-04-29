<template>
  <v-menu :close-on-content-click="false">
    <template v-slot:activator="{ props }">
      <v-btn icon v-bind="props">
        <v-avatar
          :color="isDark ? 'grey-darken-3' : 'grey-lighten-3'"
          class="elevation-6"
          icon="mdi-bell"
        ></v-avatar>
      </v-btn>
    </template>

    <v-card width="300">
      <v-list height="350">
        <notification-list-item
          v-for="notification in notifications"
          :key="notification.id"
          :item="notification"
          @update="(payload) => requestUpdateNotification(payload)"
          @delete="(payload) => (selectedId = payload.id)"
        >
        </notification-list-item>
      </v-list>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn color="primary" variant="text" @click="fetchMore"> Fetch </v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>

  <v-dialog :model-value="hasSelectedId" width="auto" persistent>
    <v-card>
      <v-card-text>Do you want to delete this notification?</v-card-text>
      <v-card-actions class="justify-end">
        <v-btn color="primary" @click="selectedId = undefined">Cancel</v-btn>
        <v-btn color="primary" @click="onSubmitDelete">Agree</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import _ from 'lodash';
import { computed, inject, ref, watch } from 'vue';

import { useSocketEventListener } from '@/composables/useSocketEventListener';
import { useSocketNotifications } from '@/composables/useSocketNotifications';
import { KEYS } from '@/constants';
import {
  IDeleteNotificationRequest,
  INotificationResponse,
  ISearchNotificationRequest,
  IUpdateNotificationRequest,
  NotificationStatus,
} from '@/interfaces/notifications';

import NotificationListItem from './NotificationListItem.vue';

const isDark = inject(KEYS.THEMES.IS_DARK)!;

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

const throttleRequestRooms = _.throttle(requestNotifications, 500);

function fetchMore() {
  const excludeIds = _.map(notifications.value, (room) => room.id);

  throttleRequestRooms({
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

const selectedId = ref<string>();
const hasSelectedId = computed(() => !_.isUndefined(selectedId.value));

function onSubmitDelete() {
  if (!_.isUndefined(selectedId.value)) {
    requestDeleteNotification({ id: selectedId.value });
  }
  selectedId.value = undefined;
}
</script>
