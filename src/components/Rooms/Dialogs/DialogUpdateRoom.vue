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

        <v-toolbar-title>Room</v-toolbar-title>
      </v-toolbar>

      <v-card-text>
        <v-text-field
          class="mt-3"
          label="Room name"
          variant="outlined"
          v-model="v$.name.$model"
          :error-messages="getErrorMessage(v$.name)"
          @blur="v$.name.$validate"
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
import { maxLength, required } from "@vuelidate/validators";
import { inject, reactive, watch } from "vue";

import { getErrorMessage, useVuelidate } from "@/composables/useVuelidate";
import { KEYS } from "@/constants";
import { UpdateRoomRequest } from "@/interfaces/rooms";

const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (event: "update:modelValue", value: boolean): void;
  (event: "submit", value: UpdateRoomRequest): void;
}>();

const room = inject(KEYS.CHAT.ROOM)!;

const form = reactive<UpdateRoomRequest>({
  id: "",
  name: "",
});

const [v$, { handleSubmit, submitable }] = useVuelidate(
  {
    id: {
      required: required,
    },
    name: {
      required,
      maxLength: maxLength(255),
    },
  },
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

    form.id = room.value?.id ?? "";
    form.name = room.value?.name ?? "";
  
    v$.value.$reset();
  },
  { immediate: true }
);
</script>
