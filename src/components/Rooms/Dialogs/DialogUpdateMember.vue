<template>
  <v-base-dialog
    mobile-width="500"
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    :disabled-submit="!submitable"
    @submit="onSubmit"
    @open="onOpen"
  >
    <template #title>Room Member</template>

    <v-text-field
      class="mt-3"
      label="Nickname"
      v-model="v$.nickName.$model"
      :error-messages="getErrorMessage(v$.nickName)"
      @blur="v$.nickName.$validate"
      clearable
      hint="Click clear icon to clear nickname"
    ></v-text-field>

    <template #action>Edit</template>
  </v-base-dialog>
</template>

<script lang="ts" setup>
import { maxLength, required, requiredIf } from '@vuelidate/validators';
import _ from 'lodash';
import { computed, inject, reactive } from 'vue';

import { getErrorMessage, useVuelidate } from '@/composables';
import { KEYS } from '@/constants';
import { IUpdateRoomMemberRequest } from '@/interfaces';

const props = defineProps<{
  modelValue: boolean;
  memberId: string;
}>();

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void;
  (event: 'submit', value: IUpdateRoomMemberRequest): void;
}>();

const room = inject(KEYS.CHAT.ROOM)!;

const form = reactive<IUpdateRoomMemberRequest & { nickName: string | null }>({
  memberId: '',
  roomId: '',
  nickName: null,
  role: undefined,
});

const [v$, { handleSubmit, submitable }] = useVuelidate(
  computed(() => ({
    memberId: {
      required: required,
    },
    roomId: {
      required: required,
    },
    nickName: {
      required: requiredIf(() => form.nickName !== null),
      maxLength: maxLength(255),
    },
  })),
  form,
);

const onSubmit = handleSubmit((data) => {
  emit('submit', data);
  emit('update:modelValue', false);
});

function onOpen() {
  const roomMember = _.find(
    room.value?.roomMembers,
    (roomMember) => roomMember.member.id === props.memberId,
  );

  if (!roomMember) {
    emit('update:modelValue', false);
    return;
  }

  form.memberId = roomMember.member.id;
  form.roomId = room.value?.id ?? '';
  form.nickName = roomMember.nickName;

  v$.value.$reset();
}
</script>
