<template>
  <v-dialog
    :width="$vuetify.display.smAndDown ? undefined : 500"
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    :fullscreen="$vuetify.display.smAndDown"
  >
    <v-card>
      <v-toolbar color="surface" elevation="2">
        <v-app-bar-nav-icon
          :icon="$vuetify.display.smAndDown ? 'mdi-arrow-left' : 'mdi-close'"
          @click="emit('update:modelValue', false)"
        >
        </v-app-bar-nav-icon>

        <v-toolbar-title>Room Member</v-toolbar-title>
      </v-toolbar>

      <v-card-text>
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
          <v-radio
            label="Moderator"
            value="Moderator"
            :error="v$.role.$error"
          />
          <v-radio label="Member" value="Member" :error="v$.role.$error" />
        </v-radio-group>
      </v-card-text>

      <v-card-actions>
        <v-btn color="primary" block @click="onSubmit" :disabled="!submitable">
          Change
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { required } from '@vuelidate/validators';
import _ from 'lodash';
import { computed, inject, reactive, watch } from 'vue';

import { getErrorMessage, useVuelidate } from '@/composables/useVuelidate';
import { KEYS } from '@/constants';
import { IUpdateRoomMemberRequest } from '@/interfaces/rooms';

const props = defineProps<{
  modelValue: boolean;
  memberId: string;
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

const onSubmit = handleSubmit((data) => {
  emit('submit', data);
  emit('update:modelValue', false);
});

watch(
  () => props.modelValue,
  (current) => {
    if (!current) {
      return;
    }

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
    form.role = roomMember.role;

    v$.value.$reset();
  },
  { immediate: true },
);
</script>
