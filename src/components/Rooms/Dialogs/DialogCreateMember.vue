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
        <v-autocomplete
          class="mt-3"
          v-model="v$.member.$model"
          v-model:search="userSearch"
          :loading="isLoadingSearch"
          variant="outlined"
          label="Member"
          :items="usersResult"
          item-title="username"
          return-object
          hide-no-data
          :error-messages="getErrorMessage(v$.member)"
          @blur="v$.member.$validate"
        >
          <template v-slot:item="{ props, item }">
            <v-list-item
              v-bind="props"
              :title="item?.raw?.username"
            ></v-list-item>
          </template>
        </v-autocomplete>

        <v-radio-group
          label="Role"
          v-model="v$.role.$model"
          :error-messages="getErrorMessage(v$.role)"
          @blur="v$.role.$validate"
        >
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
          Add
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { required } from "@vuelidate/validators";
import _ from "lodash";
import { computed, inject, reactive, ref, watch } from "vue";

import { useAxios } from "@/composables/useAxios";
import {
  getErrorMessage,
  setFieldData,
  useVuelidate,
} from "@/composables/useVuelidate";
import { KEYS } from "@/constants";
import { CreateRoomMemberRequest } from "@/interfaces/rooms";
import { SearchUsersRequest, UserResponse } from "@/interfaces/users";
import { services } from "@/services";

const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (event: "update:modelValue", value: boolean): void;
  (event: "submit", value: CreateRoomMemberRequest): void;
}>();

const room = inject(KEYS.CHAT.ROOM)!;

const form = reactive<
  Omit<CreateRoomMemberRequest, "memberId"> & {
    role: string;
    member: UserResponse | null;
  }
>({
  member: null,
  roomId: "",
  role: "",
});

const [v$, { handleSubmit, submitable }] = useVuelidate(
  computed(() => ({
    member: {
      required: required,
    },
    roomId: {
      required: required,
    },
    role: {
      required: required,
    },
  })),
  form
);

const onSubmit = handleSubmit((formData) => {
  console.log(formData)
  const data: CreateRoomMemberRequest = {
    roomId: formData.roomId,
    role: formData.role,
    memberId: formData.member?.id ?? "",
  };
  emit("submit", data);
  emit("update:modelValue", false);
});

const { excute: excuteSearchUsers } = useAxios(services.users, "getAll");

const userSearch = ref<string>("");
const usersResult = ref<Array<UserResponse>>([]);

const isLoadingSearch = ref<boolean>(false);

const debounceExcuteSearchUsers = _.debounce(
  async (params: SearchUsersRequest) => {
    usersResult.value = await excuteSearchUsers(params);
    isLoadingSearch.value = false;
  },
  1000
);

watch(userSearch, (search) => {
  if (!search) {
    return;
  }

  isLoadingSearch.value = true;
  debounceExcuteSearchUsers({ search });
});

watch(
  () => props.modelValue,
  (current) => {
    if (!current) {
      return;
    }

    userSearch.value = "";
    usersResult.value = [];

    form.roomId = room.value?.id ?? setFieldData<string>(undefined);
    form.member = null;
    form.role = setFieldData<string>(undefined);

    v$.value.$reset();
  },
  { immediate: true }
);
</script>
