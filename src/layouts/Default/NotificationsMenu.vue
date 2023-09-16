<template>
  <v-btn icon>
    <v-avatar color="primary" icon="mdi-bell" />

    <v-base-menu :title="translate('title')">
      <template #default="{ close, isMenu }">
        <div v-if="isMenu">
          <v-card-title>
            {{ translate('title') }}
          </v-card-title>
          <v-divider />
        </div>
        <v-list
          :max-height="$vuetify.display.mdAndUp ? 350 : undefined"
          class="mb-4"
        >
          <v-notification-list-item
            v-for="notification in notifications"
            :key="notification.id"
            :item="notification"
            @update="(payload) => requestUpdateNotification(payload)"
            @delete="(payload) => onRequestDeleteNotification(payload)"
            @click="close"
          />
          <v-list-item v-intersect="onIntersect" class="text-center">
            <v-btn
              :loading="isLoading"
              icon="mdi-arrow-down"
              size="small"
              variant="plain"
              @click="fetchMoreNotifications"
            />
          </v-list-item>
        </v-list>
      </template>
    </v-base-menu>
  </v-btn>
</template>

<script lang="ts" setup>
import _ from 'lodash';
import { ref, watch } from 'vue';

import {
  useAlert,
  useFetchIntersection,
  useLayoutLocale,
  useSocketEventListener,
  useSocketNotifications,
} from '@/composables';
import {
  IDeleteNotificationRequest,
  INotificationResponse,
  ISearchNotificationsRequest,
  IUpdateNotificationRequest,
  NotificationStatus,
} from '@/interfaces';
import VNotificationListItem from '@/layouts/Default/NotificationListItem.vue';

const { translate, makeTranslateAlert } = useLayoutLocale({
  prefix: 'default.topAppBar.notification',
});

const notifications = ref<Array<INotificationResponse>>([]);

const socket = useSocketNotifications();

const isAllNotificationsLoaded = ref<boolean>(false);

const { isLoading, request: requestNotifications } = useSocketEventListener<
  {
    notifications: Array<INotificationResponse>;
  },
  ISearchNotificationsRequest
>(socket, 'list:notification', {
  response({ notifications: data }) {
    notifications.value = _.uniqBy(
      [...notifications.value, ...data],
      (notification) => notification.id,
    );

    if (!data.length) {
      isAllNotificationsLoaded.value = true;
    }
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

function fetchMoreNotifications() {
  const excludeIds = _.map(notifications.value, (room) => room.id);

  requestNotifications({
    take: 10,
    excludeIds: excludeIds.length ? excludeIds : undefined,
  });
}

const { onIntersect } = useFetchIntersection({
  fetch: fetchMoreNotifications,
  ms: 500,
  isLoading,
  isAllLoaded: isAllNotificationsLoaded,
});

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

const translateAlert = makeTranslateAlert('delete');

async function onRequestDeleteNotification(
  payload: IDeleteNotificationRequest,
) {
  const { isConfirm } = await alert.fire({
    cancelButton: { show: true, text: translateAlert('cancel') },
    confirmButton: { show: true, text: translateAlert('confirm') },
    message: translateAlert('message'),
  });

  if (!isConfirm) {
    return true;
  }

  requestDeleteNotification(payload);
}
</script>
