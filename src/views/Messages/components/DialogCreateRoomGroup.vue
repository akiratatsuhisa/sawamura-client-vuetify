<template>
  <v-base-dialog
    desktop-width="500"
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    :disabled-submit="!submitable"
    @submit="onSubmit"
    @open="onOpen"
  >
    <template #title>{{ translate('title') }}</template>

    <v-text-field
      class="mt-3"
      :label="translateFormField('name')"
      v-model="v$.name.$model"
      :error-messages="getErrorMessage(v$.name)"
      @blur="v$.name.$validate"
    />

    <v-autocomplete
      class="mt-3"
      multiple
      v-model="form.members"
      v-model:search="userSearch"
      :loading="isLoadingSearch"
      variant="outlined"
      :label="translateFormField('members')"
      :items="usersResult"
      chips
      closable-chips
      return-object
      hide-no-data
      :error-messages="getErrorMessage(v$.members)"
      @blur="v$.members.$validate"
    >
      <template #chip="{ props, item }">
        <v-chip v-bind="props" :text="item.raw.username" />
      </template>

      <template #item="{ props, item }">
        <v-list-item v-bind="props" :title="item?.raw?.username" />
      </template>
    </v-autocomplete>

    <template #action>{{ translate('form.submit') }}</template>
  </v-base-dialog>
</template>

<script lang="ts" setup>
import { useDebounceFn } from '@vueuse/core';
import { computed, reactive, ref, watch } from 'vue';

import {
  getErrorMessage,
  useAuth,
  useAxios,
  usePageLocale,
  useVuelidate,
} from '@/composables';
import {
  IAdvancedUserResponse,
  ICreateRoomRequest,
  ISearchAdvancedUsersRequest,
} from '@/interfaces';
import { services } from '@/services';
import { required } from '@/validators';

defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void;
  (event: 'submit', value: ICreateRoomRequest): void;
}>();

const { translate, translateFormField, pathFormField } = usePageLocale({
  prefix: 'messages.list.dialogs.createGroup',
});

const { identityId } = useAuth();

const form = reactive<
  Omit<ICreateRoomRequest, 'members'> & {
    members: Array<IAdvancedUserResponse>;
  }
>({
  name: '',
  isGroup: true,
  members: [],
});

const [v$, { handleSubmit, submitable }] = useVuelidate(
  computed(() => ({
    name: {
      required: required(pathFormField('name')),
    },
    members: {
      required: required(pathFormField('members')),
    },
  })),
  form,
);

const onSubmit = handleSubmit((formData) => {
  const data: ICreateRoomRequest = {
    ...formData,
    members: [
      {
        memberId: identityId.value ?? '',
        role: 'Administrator',
      },
      ...formData.members.map((value) => ({
        memberId: value.id,
        role: 'Member',
      })),
    ],
  };

  emit('submit', data);
  emit('update:modelValue', false);
});

const { request: requestSearchUsers } = useAxios(
  services.profileUsers,
  'searchAdvanced',
);

const userSearch = ref<string>('');
const usersResult = ref<Array<IAdvancedUserResponse>>([]);

const isLoadingSearch = ref<boolean>(false);

const excuteSearchUsersDebounce = useDebounceFn(
  async (params: ISearchAdvancedUsersRequest) => {
    usersResult.value = await requestSearchUsers(params);
    isLoadingSearch.value = false;
  },
  250,
);

watch(userSearch, (search) => {
  if (!search) {
    return;
  }

  isLoadingSearch.value = true;
  excuteSearchUsersDebounce({ search });
});

function onOpen() {
  form.name = '';
  form.members = [];

  userSearch.value = '';
  usersResult.value = [];

  v$.value.$reset();
}
</script>
