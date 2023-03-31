<template>
  <base-dialog
    mobile-width="500"
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    @submit="onSubmit"
    @open="onOpen"
  >
    <template #title>Room Member</template>

    <span>{{ message }}</span>

    <template #action>Delete</template>
  </base-dialog>
</template>

<script lang="ts" setup>
import { required } from '@vuelidate/validators';
import _ from 'lodash';
import { computed, inject, reactive, ref } from 'vue';

import { useVuelidate } from '@/composables/useVuelidate';
import { KEYS } from '@/constants';
import { IDeleteRoomMemberRequest } from '@/interfaces/rooms';

const props = defineProps<{
  modelValue: boolean;
  memberId: string;
}>();

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void;
  (event: 'submit', value: IDeleteRoomMemberRequest): void;
}>();

const message = ref('');

const room = inject(KEYS.CHAT.ROOM)!;

const currentMember = inject(KEYS.CHAT.CURRENT_MEMBER)!;

const form = reactive<IDeleteRoomMemberRequest>({
  memberId: '',
  roomId: '',
});

const [v$, { handleSubmit }] = useVuelidate(
  computed(() => ({
    memberId: {
      required: required,
    },
    roomId: {
      required: required,
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

  message.value =
    currentMember.value?.id === roomMember.id
      ? 'Do you want to out this group?'
      : `Do you want to remove member ${
          roomMember.nickName ?? roomMember.member.username
        }?`;

  form.memberId = roomMember.member.id;
  form.roomId = room.value?.id ?? '';

  v$.value.$reset();
}
</script>
