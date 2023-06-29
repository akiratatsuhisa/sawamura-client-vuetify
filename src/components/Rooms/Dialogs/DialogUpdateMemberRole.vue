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

    <v-radio-group
      v-model="v$.role.$model"
      :error-messages="getErrorMessage(v$.role)"
      @blur="v$.role.$validate"
      label="Change Role"
    >
      <v-radio
        v-if="currentMember?.role === 'Admin'"
        label="Administrator"
        value="Admin"
        :error="v$.role.$error"
      />
      <v-radio label="Moderator" value="Moderator" :error="v$.role.$error" />
      <v-radio label="Member" value="Member" :error="v$.role.$error" />
    </v-radio-group>

    <template #action>Change</template>
  </v-base-dialog>
</template>

<script lang="ts" setup>
import { required } from '@vuelidate/validators';
import _ from 'lodash';
import { computed, inject, reactive } from 'vue';
import { useRoute } from 'vue-router';

import { getErrorMessage, useVuelidate } from '@/composables';
import { KEYS } from '@/constants';
import { IUpdateRoomMemberRequest } from '@/interfaces';

defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void;
  (event: 'submit', value: IUpdateRoomMemberRequest): void;
}>();

const room = inject(KEYS.CHAT.ROOM)!;

const currentMember = inject(KEYS.CHAT.CURRENT_MEMBER)!;

const form = reactive<IUpdateRoomMemberRequest & { role: string }>({
  memberId: '',
  roomId: '',
  nickName: undefined,
  role: '',
});

const [v$, { handleSubmit, submitable }] = useVuelidate(
  computed(() => ({
    memberId: {
      required: required,
    },
    roomId: {
      required: required,
    },
    role: {
      required: required,
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

  form.memberId = roomMember.member.id;
  form.roomId = room.value?.id ?? '';
  form.role = roomMember.role;

  v$.value.$reset();
}
</script>
