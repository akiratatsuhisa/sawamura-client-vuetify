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

        <v-toolbar-title>Create Group</v-toolbar-title>
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

        <v-autocomplete
          class="mt-3"
          v-model="v$.members.$model"
          v-model:search="userSearch"
          :loading="isLoadingSearch"
          variant="outlined"
          label="Member(s)"
          :items="usersResult"
          chips
          closable-chips
          return-object
          hide-no-data
          :error-messages="getErrorMessage(v$.members)"
          @blur="v$.members.$validate"
          multiple
        >
          <template v-slot:chip="{ props, item }">
            <v-chip v-bind="props" :text="item.raw.username"></v-chip>
          </template>

          <template v-slot:item="{ props, item }">
            <v-list-item
              v-bind="props"
              :title="item?.raw?.username"
            ></v-list-item>
          </template>
        </v-autocomplete>
      </v-card-text>

      <v-card-actions>
        <v-btn color="primary" block @click="onSubmit" :disabled="!submitable">
          Create
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { required } from "@vuelidate/validators";
import _ from "lodash";
import { computed, reactive, ref, watch } from "vue";

import { useAuth } from "@/composables/useAuth";
import { useAxios } from "@/composables/useAxios";
import { getErrorMessage, useVuelidate } from "@/composables/useVuelidate";
import { ICreateRoomRequest } from "@/interfaces/rooms";
import { ISearchUsersRequest, IUserResponse } from "@/interfaces/users";
import { services } from "@/services";

const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (event: "update:modelValue", value: boolean): void;
  (event: "submit", value: ICreateRoomRequest): void;
}>();

const { identityId } = useAuth();

const form = reactive<
  Omit<ICreateRoomRequest, "members"> & { members: Array<IUserResponse> }
>({
  name: "",
  isGroup: true,
  members: [],
});

const [v$, { handleSubmit, submitable }] = useVuelidate(
  computed(() => ({
    name: {
      required: required,
    },
    members: {
      required: required,
    },
  })),
  form
);

const onSubmit = handleSubmit((formData) => {
  const data: ICreateRoomRequest = {
    ...formData,
    members: [
      {
        memberId: identityId.value ?? "",
        role: "Admin",
      },
      ...formData.members.map((value) => ({
        memberId: value.id,
        role: "Member",
      })),
    ],
  };
  emit("submit", data);
  emit("update:modelValue", false);
});

const { excute: excuteSearchUsers } = useAxios(services.users, "getAll");

const userSearch = ref<string>("");
const usersResult = ref<Array<IUserResponse>>([]);

const isLoadingSearch = ref<boolean>(false);

const debounceExcuteSearchUsers = _.debounce(
  async (params: ISearchUsersRequest) => {
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

    form.name = "";
    form.members = [];

    userSearch.value = "";
    usersResult.value = [];

    v$.value.$reset();
  },
  { immediate: true }
);
</script>
