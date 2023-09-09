<template>
  <v-base-dialog
    mobile-width="500"
    :model-value="modelValue"
    :disabled-submit="isLoading"
    @update:model-value="emit('update:modelValue', $event)"
    @submit="onSubmit"
    @open="onOpen"
  >
    <template #title>{{ translate('title') }}</template>

    <v-switch
      v-model="displayMode"
      :label="translate('displayMode')"
      color="tertiary"
      true-icon="mdi-format-list-checks"
      inset
      hide-details
    />
    <v-list-subheader>{{ translate('subtitle') }}</v-list-subheader>

    <template v-if="displayMode">
      <template v-for="(list, key) in roleListByTag" :key="key">
        <v-divider class="my-3" />
        <v-list-subheader>{{ translate(`tags.${key}`) }}</v-list-subheader>
        <v-checkbox
          v-for="{ id, name, ...value } in list"
          v-model="form.roleIds"
          :key="id"
          :value="id"
          :append-icon="value.default ? 'mdi-shield-lock-outline' : undefined"
          density="comfortable"
          hide-details
        >
          <template #label>
            {{ name }}
          </template>
        </v-checkbox>
      </template>
    </template>

    <template v-else>
      <v-divider class="my-3" />
      <v-chip-group v-model="form.roleIds" filter multiple class="d-inline">
        <v-chip
          v-for="{ id, name, ...value } in roleList"
          :key="id"
          :value="id"
          rounded="lg"
          variant="outlined"
          :append-icon="value.default ? 'mdi-shield-lock-outline' : undefined"
        >
          {{ name }}
        </v-chip>
      </v-chip-group>
    </template>

    <template #action>{{ translate('form.submit') }}</template>
  </v-base-dialog>
</template>

<script lang="ts" setup>
import _ from 'lodash';
import { computed, inject, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';

import { useAxios, usePageLocale } from '@/composables';
import { KEYS } from '@/constants';
import { IChangeUserRolesRequest } from '@/interfaces';
import { services } from '@/services';

defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void;
  (event: 'submit'): void;
}>();

const { translate } = usePageLocale({
  prefix: 'dashboard.users.changeRoles',
});

const displayMode = ref<boolean>(false);

const roleList = inject(KEYS.DASHBOARD.USERS.DIALOGS.CHANGE_ROLES.ROLE_LIST)!;
const roleListByTag = computed(() => {
  return _.groupBy(roleList.value, (role) =>
    role.default ? 'default' : 'notDefault',
  );
});

const form = reactive<IChangeUserRolesRequest>({ id: '', roleIds: [] });

const route = useRoute();
const {
  excute: requestUser,
  isLoading: isLoadingUser,
  data: user,
} = useAxios(services.users, 'getById');

async function onOpen() {
  try {
    const result = await requestUser({ id: route.params.id as string });

    form.id = result.id;
    form.roleIds = _(result.userRoles)
      .map(
        (userRole) =>
          _.find(roleList.value, (role) => role.name === userRole.role.name)
            ?.id,
      )
      .compact()
      .value();
  } catch {
    emit('update:modelValue', false);
  }
}

const { excute: requestChangeRoles, isLoading: isLoadingChangeRoles } =
  useAxios(services.users, 'changeRoles', {
    message: computed(() =>
      translate('message', { username: user.value?.username ?? '' }),
    ),
  });

async function onSubmit() {
  await requestChangeRoles(form);
  emit('submit');
  emit('update:modelValue', false);
}

const isLoading = computed(
  () => isLoadingUser.value || isLoadingChangeRoles.value,
);
</script>
