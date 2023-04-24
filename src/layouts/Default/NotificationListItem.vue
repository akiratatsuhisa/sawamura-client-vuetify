<template>
  <v-list-item class="pa-1" @click="onClick">
    <template #prepend>
      <v-avatar color="secondary" :image="photoUrl"></v-avatar>
    </template>

    <v-list-item-title>{{ (item.params as any).content }}</v-list-item-title>
    <v-list-item-subtitle>{{ item.sourceUser.username }}</v-list-item-subtitle>

    <template #append>
      <v-btn size="small" variant="text" icon @click.stop="update">
        <v-icon
          size="x-large"
          :icon="
            item.status === NotificationStatus.Archived
              ? 'mdi-star'
              : 'mdi-star-outline'
          "
        ></v-icon>
      </v-btn>
      <v-btn
        size="small"
        variant="plain"
        color="secondary"
        icon
        @click.stop="emit('delete', { id: item.id })"
      >
        <v-icon size="x-large" icon="mdi-trash-can"></v-icon>
      </v-btn>
    </template>
  </v-list-item>

  <v-divider inset></v-divider>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { RouteLocationRaw, useRouter } from 'vue-router';

import {
  INotificationResponse,
  NotificationEntityName,
  NotificationStatus,
} from '@/interfaces/notifications';

const props = defineProps<{ item: INotificationResponse }>();

const emit = defineEmits<{
  (
    event: 'update',
    payload: {
      id: string;
      status:
        | NotificationStatus.Delivered
        | NotificationStatus.Viewed
        | NotificationStatus.Read
        | NotificationStatus.Archived;
    },
  ): void;
  (
    event: 'delete',
    payload: {
      id: string;
    },
  ): void;
}>();

const router = useRouter();

const photoUrl = computed(() =>
  props.item.sourceUser?.photoUrl
    ? `${import.meta.env.VITE_API_URL}/auth/photo?username=${
        props.item.sourceUser.username
      }`
    : import.meta.env.VITE_NO_AVATAR_URL,
);

const redirectUrl = computed<RouteLocationRaw | undefined>(() => {
  switch (props.item.entity) {
    case NotificationEntityName.RoomMessage:
      return {
        name: 'Messages:Room',
        params: { roomId: (props.item.reference as any).roomId },
      };
    case NotificationEntityName.Room:
      return {
        name: 'Messages:Room',
        params: { roomId: (props.item.reference as any).id },
      };
    default:
      return undefined;
  }
});

function onClick() {
  if (props.item.status !== NotificationStatus.Archived) {
    emit('update', { id: props.item.id, status: NotificationStatus.Read });
  }

  if (redirectUrl.value) {
    router.push(redirectUrl.value);
  }
}

function update() {
  const status =
    props.item.status === NotificationStatus.Archived
      ? NotificationStatus.Read
      : NotificationStatus.Archived;
  emit('update', { id: props.item.id, status });
}
</script>
