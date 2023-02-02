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

      <v-card-text> {{ message }} </v-card-text>

      <v-card-actions>
        <v-btn color="primary" block @click="onSubmit"> Delete </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { required } from "@vuelidate/validators";
import _ from "lodash";
import { computed, inject, reactive, ref, watch } from "vue";

import { useVuelidate } from "@/composables/useVuelidate";
import { KEYS } from "@/constants";
import { DeleteRoomMemberRequest } from "@/interfaces/rooms";

const props = defineProps<{
  modelValue: boolean;
  memberId: string;
}>();

const emit = defineEmits<{
  (event: "update:modelValue", value: boolean): void;
  (event: "submit", value: DeleteRoomMemberRequest): void;
}>();

const room = inject(KEYS.CHAT.ROOM)!;

const currentMember = inject(KEYS.CHAT.CURRENT_MEMBER)!;

const form = reactive<DeleteRoomMemberRequest>({
  memberId: "",
  roomId: "",
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
  form
);

const onSubmit = handleSubmit((data) => {
  emit("submit", data);
  emit("update:modelValue", false);
});

const message = ref("");

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

    message.value =
      currentMember.value?.id === roomMember.id
        ? "Do you want to out this group?"
        : `Do you want to remove member ${
            roomMember.nickName ?? roomMember.member.username
          }?`;

    form.memberId = roomMember.member.id;
    form.roomId = room.value?.id ?? "";

    v$.value.$reset();
  },
  { immediate: true }
);
</script>
