<template>
  <v-base-dialog
    desktop-width="500"
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    :disabled-submit="!submitable"
    @submit="onSubmit"
    @open="onOpen"
  >
    <template #title>{{ translate('title') }}</template>

    <v-radio-group
      v-model="v$.role.$model"
      :error-messages="getErrorMessage(v$.role)"
      @blur="v$.role.$validate"
      :label="translateFormField('role')"
    >
      <v-radio
        v-if="currentMember?.role === 'Administrator'"
        :label="$t('common.roomRoles.administrator')"
        value="Administrator"
        :error="v$.role.$error"
      />

      <v-radio
        :label="$t('common.roomRoles.moderator')"
        value="Moderator"
        :error="v$.role.$error"
      />

      <v-radio
        :label="$t('common.roomRoles.member')"
        value="Member"
        :error="v$.role.$error"
      />
    </v-radio-group>

    <template #action>{{ translate('form.submit') }}</template>
  </v-base-dialog>
</template>

<script lang="ts" setup>
import _ from 'lodash';
import { computed, inject, reactive } from 'vue';
import { useRoute } from 'vue-router';

import { getErrorMessage, usePageLocale, useVuelidate } from '@/composables';
import { KEYS } from '@/constants';
import { IUpdateRoomMemberRequest } from '@/interfaces';
import { required } from '@/validators';

defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void;
  (event: 'submit', value: IUpdateRoomMemberRequest): void;
}>();

const { translate, translateFormField, pathFormField } = usePageLocale({
  prefix: 'messages.room.dialogs.changeRole',
});

const room = inject(KEYS.CHAT.ROOM)!;

const currentMember = inject(KEYS.CHAT.CURRENT_MEMBER)!;

const form = reactive<IUpdateRoomMemberRequest & { role: string }>({
  roomId: '',
  memberId: '',
  nickName: undefined,
  role: '',
});

const [v$, { handleSubmit, submitable }] = useVuelidate(
  computed(() => ({
    roomId: {
      required: required(pathFormField('roomId')),
    },
    memberId: {
      required: required(pathFormField('memberId')),
    },
    role: {
      required: required(pathFormField('role')),
    },
  })),
  form,
);

const route = useRoute();

const onSubmit = handleSubmit((data) => {
  emit('submit', data);
  emit('update:modelValue', false);
});

function onOpen() {
  const roomMember = _.find(
    room.value?.roomMembers,
    (roomMember) => roomMember.member.id === route.params.memberId,
  );

  if (!roomMember) {
    emit('update:modelValue', false);
    return;
  }

  form.roomId = room.value?.id ?? '';
  form.memberId = roomMember.member.id;
  form.role = roomMember.role;

  v$.value.$reset();
}
</script>
