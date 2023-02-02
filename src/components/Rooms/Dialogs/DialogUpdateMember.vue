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
        <v-text-field
          class="mt-3"
          label="Nickname"
          variant="outlined"
          v-model="v$.nickName.$model"
          hint="click clear icon to clear nickname"
          :error-messages="getErrorMessage(v$.nickName)"
          @blur="v$.nickName.$validate"
          clearable
        ></v-text-field>
      </v-card-text>

      <v-card-actions>
        <v-btn color="primary" block @click="onSubmit" :disabled="!submitable">
          Edit
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { maxLength, required, requiredIf } from "@vuelidate/validators";
import _ from "lodash";
import { computed, inject, reactive, watch } from "vue";

import { getErrorMessage, useVuelidate } from "@/composables/useVuelidate";
import { KEYS } from "@/constants";
import { IUpdateRoomMemberRequest } from "@/interfaces/rooms";

const props = defineProps<{
  modelValue: boolean;
  memberId: string;
}>();

const emit = defineEmits<{
  (event: "update:modelValue", value: boolean): void;
  (event: "submit", value: IUpdateRoomMemberRequest): void;
}>();

const room = inject(KEYS.CHAT.ROOM)!;

const form = reactive<IUpdateRoomMemberRequest & { nickName: string | null }>({
  memberId: "",
  roomId: "",
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
  form
);

const onSubmit = handleSubmit((data) => {
  emit("submit", data);
  emit("update:modelValue", false);
});

watch(
  () => props.modelValue,
  (current) => {
    if (!current) {
      return;
    }

    const roomMember = _.find(
      room.value?.roomMembers,
      (roomMember) => roomMember.member.id === props.memberId
    );

    if (!roomMember) {
      emit("update:modelValue", false);
      return;
    }

    form.memberId = roomMember.member.id;
    form.roomId = room.value?.id ?? "";
    form.nickName = roomMember.nickName;

    v$.value.$reset();
  },
  { immediate: true }
);
</script>
