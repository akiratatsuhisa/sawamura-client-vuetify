<template>
  <v-list-item @click.prevent="() => undefined" rounded="pill">
    <template #prepend>
      <v-btn
        icon
        variant="flat"
        size="small"
        color="secondary-container"
        class="mr-4"
        :to="{
          name: 'Users:Detail',
          params: { username: roomMember.member.username },
        }"
      >
        <v-avatar color="secondary-container" tag="button" :image="photoUrl" />
      </v-btn>
    </template>

    <v-list-item-title>
      {{ roomMember.nickName ?? roomMember.member.displayName }}
    </v-list-item-title>

    <v-list-item-subtitle>
      {{ $t(`common.roomRoles.${_.camelCase(roomMember.role)}`) }}
      -
      {{ roomMember.member.displayName }}
    </v-list-item-subtitle>

    <template #append>
      <v-menu>
        <template #activator="{ props }">
          <v-btn
            class="align-self-center"
            icon="mdi-dots-vertical"
            variant="tonal"
            size="x-small"
            v-bind="props"
            :loading="isLoading"
          ></v-btn>
        </template>

        <v-list class="bg-surface-container-high text-on-surface" rounded="xl">
          <v-list-item
            append-icon="mdi-account-circle-outline"
            :title="translate('menus.members.profileUser')"
            :to="{
              name: 'Users:Detail',
              params: { username: roomMember.member.username },
            }"
          />
          <v-list-item
            append-icon="mdi-account-edit-outline"
            :title="translate('menus.members.changeNickName')"
            @click="onOpenDialog('update')"
          />
          <v-list-item
            v-if="isShow"
            append-icon="mdi-database-edit-outline"
            :title="translate('menus.members.changeRole')"
            @click="onOpenDialog('role')"
          />
          <v-list-item
            v-if="isShow"
            append-icon="mdi-account-minus-outline"
            :title="translate('menus.members.removeMember')"
            @click="onOpenDialog('delete')"
          />
        </v-list>
      </v-menu>
    </template>
  </v-list-item>
</template>

<script lang="ts" setup>
import _ from 'lodash';
import { computed, inject } from 'vue';

import { usePageLocale, useUserImage } from '@/composables';
import { KEYS } from '@/constants';
import { IRoomMemberResponse } from '@/interfaces';

const props = defineProps<{
  roomMember: IRoomMemberResponse;
  isLoading: boolean;
  isGroup: boolean;
}>();

const emit = defineEmits<{
  (
    event: 'openDialog',
    payload: {
      memberDialog: string;
      memberId: string;
    },
  ): void;
}>();

const photoUrl = useUserImage(
  'photo',
  computed(() => props.roomMember.member),
);

function onOpenDialog(dialog: string) {
  emit('openDialog', {
    memberDialog: dialog,
    memberId: props.roomMember.member.id,
  });
}

const { translate } = usePageLocale({
  prefix: 'messages.room',
});

const currentMember = inject(KEYS.CHAT.CURRENT_MEMBER)!;

const isShow = computed(
  () =>
    props.isGroup &&
    currentMember.value?.role !== 'Member' &&
    !(
      currentMember.value?.role === 'Moderator' &&
      props.roomMember.role === 'Administrator'
    ),
);
</script>
