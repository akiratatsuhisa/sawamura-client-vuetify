<template>
  <v-base-dialog
    mobile-width="500"
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    :disabled-submit="!submitable"
    @submit="onSubmit"
    @open="onOpen"
  >
    <template #title>{{ translate('title') }}</template>

    <v-autocomplete
      class="mt-3"
      v-model="v$.member.$model"
      v-model:search="userSearch"
      :loading="isLoadingSearch"
      variant="outlined"
      :label="translateFormField('member')"
      :items="usersResult"
      item-title="username"
      return-object
      hide-no-data
      :error-messages="getErrorMessage(v$.member)"
      @blur="v$.member.$validate"
    >
      <template v-slot:item="{ props, item }">
        <v-list-item v-bind="props" :title="item?.raw?.username"></v-list-item>
      </template>
    </v-autocomplete>

    <v-radio-group
      :label="translateFormField('role')"
      v-model="v$.role.$model"
      :error-messages="getErrorMessage(v$.role)"
      @blur="v$.role.$validate"
    >
      <v-radio
        :label="$t('common.roomRoles.moderator')"
        value="Moderator"
        :error="v$.role.$error"
      />
      <v-radio
        :label="$t('common.roomRoles.member')"
        value="Member"
        :error="v$.role.$error"
      />
    </v-radio-group>

    <template #action>{{ translate('form.submit') }}</template>
  </v-base-dialog>
</template>

<script lang="ts" setup>
import { useDebounceFn } from '@vueuse/core';
import { computed, inject, reactive, ref, watch } from 'vue';

import {
  getErrorMessage,
  setFieldData,
  useAxios,
  usePageLocale,
  useVuelidate,
} from '@/composables';
import { KEYS } from '@/constants';
import {
  IAdvancedUserResponse,
  ICreateRoomMemberRequest,
  ISearchAdvancedUsersRequest,
} from '@/interfaces';
import { services } from '@/services';
import { required } from '@/validators';

defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void;
  (event: 'submit', value: ICreateRoomMemberRequest): void;
}>();

const { translate, translateFormField, pathFormField } = usePageLocale({
  prefix: 'messages.room.dialogs.insertMember',
});

const room = inject(KEYS.CHAT.ROOM)!;

const form = reactive<
  Omit<ICreateRoomMemberRequest, 'memberId'> & {
    role: string;
    member: IAdvancedUserResponse | null;
  }
>({
  member: null,
  roomId: '',
  role: '',
});

const [v$, { handleSubmit, submitable }] = useVuelidate(
  computed(() => ({
    roomId: {
      required: required(pathFormField('roomId')),
    },
    member: {
      required: required(pathFormField('member')),
    },
    role: {
      required: required(pathFormField('role')),
    },
  })),
  form,
);

const onSubmit = handleSubmit((formData) => {
  const data: ICreateRoomMemberRequest = {
    roomId: formData.roomId,
    memberId: formData.member?.id ?? '',
    role: formData.role,
  };

  emit('submit', data);
  emit('update:modelValue', false);
});

const { excute: excuteSearchUsers } = useAxios(
  services.profileUsers,
  'searchAdvanced',
);

const userSearch = ref<string>('');
const usersResult = ref<Array<IAdvancedUserResponse>>([]);

const isLoadingSearch = ref<boolean>(false);

const excuteSearchUsersDebounce = useDebounceFn(
  async (params: ISearchAdvancedUsersRequest) => {
    usersResult.value = await excuteSearchUsers(params);
    isLoadingSearch.value = false;
  },
  1000,
);

watch(userSearch, (search) => {
  if (!search) {
    return;
  }

  isLoadingSearch.value = true;
  excuteSearchUsersDebounce({ search });
});

function onOpen() {
  userSearch.value = '';
  usersResult.value = [];

  form.roomId = room.value?.id ?? setFieldData<string>(undefined);
  form.member = null;
  form.role = setFieldData<string>(undefined);

  v$.value.$reset();
}
</script>
