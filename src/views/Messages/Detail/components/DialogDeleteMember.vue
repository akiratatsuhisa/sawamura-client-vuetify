<template>
  <v-base-dialog
    desktop-width="500"
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    @submit="onSubmit"
    @open="onOpen"
  >
    <template #title>{{ translate('title') }}</template>

    <span>{{ message }}</span>

    <template #action>{{ translate('form.submit') }}</template>
  </v-base-dialog>
</template>

<script lang="ts" setup>
import _ from 'lodash';
import { computed, inject, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';

import { usePageLocale, useVuelidate } from '@/composables';
import { KEYS } from '@/constants';
import { IDeleteRoomMemberRequest, IRoomMemberResponse } from '@/interfaces';
import { required } from '@/validators';

defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void;
  (event: 'submit', value: IDeleteRoomMemberRequest): void;
}>();

const { translate, pathFormField } = usePageLocale({
  prefix: 'messages.room.dialogs.removeMember',
});

const roomMember = ref<IRoomMemberResponse>();

const currentMember = inject(KEYS.CHAT.CURRENT_MEMBER)!;

const room = inject(KEYS.CHAT.ROOM)!;

const message = computed(() =>
  currentMember.value?.id === roomMember.value?.id
    ? translate('selfMessage')
    : translate('message', {
        member:
          roomMember.value?.nickName ?? roomMember.value?.member.displayName,
      }),
);

const form = reactive<IDeleteRoomMemberRequest>({
  roomId: '',
  memberId: '',
});

const [v$, { handleSubmit }] = useVuelidate(
  computed(() => ({
    roomId: {
      required: required(pathFormField('roomId')),
    },
    memberId: {
      required: required(pathFormField('memberId')),
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
  roomMember.value = _.find(
    room.value?.roomMembers,
    (roomMember) => roomMember.member.id === route.params.memberId,
  );

  if (!roomMember.value) {
    emit('update:modelValue', false);
    return;
  }

  form.roomId = room.value?.id ?? '';
  form.memberId = roomMember.value.member.id;

  v$.value.$reset();
}
</script>
