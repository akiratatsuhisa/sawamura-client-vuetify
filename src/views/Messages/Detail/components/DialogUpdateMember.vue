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

    <v-text-field
      class="mt-3"
      :label="translateFormField('nickName')"
      v-model="v$.nickName.$model"
      :error-messages="getErrorMessage(v$.nickName)"
      @blur="v$.nickName.$validate"
      clearable
      :hint="translateFormField('nickName', 'hint')"
    />

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
import { maxLength, required } from '@/validators';

defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void;
  (event: 'submit', value: IUpdateRoomMemberRequest): void;
}>();

const { translate, translateFormField, pathFormField } = usePageLocale({
  prefix: 'messages.room.dialogs.changeNickName',
});

const room = inject(KEYS.CHAT.ROOM)!;

const form = reactive<IUpdateRoomMemberRequest & { nickName: string | null }>({
  roomId: '',
  memberId: '',
  nickName: null,
  role: undefined,
});

const [v$, { handleSubmit, submitable }] = useVuelidate(
  computed(() => ({
    roomId: {
      required: required(pathFormField('roomId')),
    },
    memberId: {
      required: required(pathFormField('memberId')),
    },
    nickName: {
      maxLength: maxLength(pathFormField('nickName'), 255),
    },
  })),
  form,
);

const onSubmit = handleSubmit((data) => {
  emit('submit', data);
  emit('update:modelValue', false);
});

const route = useRoute();

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
  form.nickName = roomMember.nickName;

  v$.value.$reset();
}
</script>
