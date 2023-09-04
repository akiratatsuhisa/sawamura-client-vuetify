<template>
  <v-card flat>
    <v-card-title>{{ translate('title') }}</v-card-title>
    <v-card-text class="px-2 px-md-4">
      <form @submit.prevent="onSubmit()">
        <v-row class="mt-3">
          <v-col md="6" cols="12" class="pt-0">
            <v-text-field
              density="comfortable"
              prepend-inner-icon="mdi-account-circle-outline"
              v-model="v$.username.$model"
              :label="translateFormField('username')"
              :error-messages="getErrorMessage(v$.username)"
              @blur="v$.username.$validate"
            />
          </v-col>
          <v-col md="6" cols="12" class="pt-0">
            <v-text-field
              density="comfortable"
              prepend-inner-icon="mdi-card-account-details-outline"
              v-model="v$.name.$model"
              :label="translateFormField('name')"
              :error-messages="getErrorMessage(v$.name)"
              @blur="v$.name.$validate"
            />
          </v-col>
          <v-col cols="12" class="pt-0">
            <v-text-field
              density="comfortable"
              prepend-inner-icon="mdi-email-search-outline"
              v-model="v$.email.$model"
              :label="translateFormField('email')"
              :error-messages="getErrorMessage(v$.email)"
              @blur="v$.email.$validate"
            />
          </v-col>
          <v-col lg="6" md="8" cols="12" class="pt-0">
            <v-segmented-button
              block
              multiple
              density="compact"
              v-model="v$.emailStates.$model"
              :items="emailStateList"
            />
          </v-col>
          <v-col
            lg="6"
            md="4"
            cols="12"
            class="pt-md-0 d-flex justify-end align-end"
          >
            <v-btn
              type="button"
              variant="tonal"
              class="mr-1 mr-lg-3 flex-grow-1"
              :loading="isLoading"
              @click="onReset"
            >
              {{ translate('form.clear') }}
            </v-btn>
            <v-btn
              type="submit"
              variant="elevated"
              class="ml-1 ml-lg-3 flex-grow-1"
              :loading="isLoading"
            >
              {{ translate('form.submit') }}
            </v-btn>
          </v-col>
        </v-row>
      </form>
    </v-card-text>
    <v-divider />
    <v-card-text>
      <v-base-limit-page v-model:skip="form.skip" v-model:take="form.take" />
      <v-menu-chip
        v-model="v$.sort.$model"
        icon="mdi-sort"
        :label="translateFormField('sort')"
        :items="sortList"
      />
      <v-chip-group
        v-model="v$.roleIds.$model"
        class="d-inline"
        filter
        multiple
        :max="10"
      >
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
      <v-chip-group v-model="v$.roleMode.$model" class="d-inline">
        <v-chip
          value="all"
          rounded="lg"
          variant="outlined"
          :append-icon="
            form.roleMode === 'all'
              ? 'mdi-checkbox-multiple-marked-outline'
              : 'mdi-checkbox-marked-outline'
          "
          prepend-icon="mdi-account-cog-outline"
        >
          {{
            form.roleMode === 'all'
              ? $t('common.matches.all')
              : $t('common.matches.any')
          }}
        </v-chip>
      </v-chip-group>
    </v-card-text>

    <user-list :data="data" />

    <v-divider v-if="data?.count" />
    <v-base-pagination
      v-if="data?.count"
      v-model:skip="form.skip"
      v-model:take="form.take"
      :count="data?.count"
      :total-count="data?.totalCount"
      class="pa-3"
    />
  </v-card>

  <template v-for="(dialog, name) in dialogs" :key="name">
    <component
      :is="dialog.component"
      :model-value="isActiveDialog(name)"
      @update:model-value="closeDialog"
      @submit="dialog.onSubmit"
    />
  </template>
</template>

<script lang="ts" setup>
import { useThrottleFn } from '@vueuse/core';
import _ from 'lodash';
import { computed, defineAsyncComponent, provide, watch } from 'vue';

import UserList from '@/components/Dashboard/Users/UserList.vue';
import VBaseLimitPage from '@/components/VBaseLimitPage.vue';
import VBasePagination from '@/components/VBasePagination.vue';
import VMenuChip from '@/components/VMenuChip.vue';
import VSegmentedButton from '@/components/VSegmentedButton.vue';
import {
  getErrorMessage,
  useAxios,
  usePageLocale,
  useRouterDialog,
  useSearchForm,
  useVuelidate,
} from '@/composables';
import { KEYS } from '@/constants';
import { Router } from '@/helpers/router';
import { ISearchUsersRequest } from '@/interfaces';
import { services } from '@/services';
import { maxLength } from '@/validators';

const { path, translate, pathFormField, translateFormField } = usePageLocale({
  prefix: 'dashboard.users',
});

const emailStateList: Array<{
  icon: string;
  value: string;
  translate: string;
}> = [
  {
    icon: 'mdi-email-remove-outline',
    value: 'none',
    translate: 'common.verifyStates.none',
  },
  {
    icon: 'mdi-email-alert-outline',
    value: 'unverified',
    translate: 'common.verifyStates.unverified',
  },
  {
    icon: 'mdi-email-check-outline',
    value: 'verified',
    translate: 'common.verifyStates.verified',
  },
];

const sortList: Array<{
  icon: string;
  value: { field: string; order: string };
  translate: string;
}> = [
  {
    icon: 'mdi-sort-alphabetical-ascending',
    value: { field: 'username', order: 'asc' },
    translate: path('sortList.usernameAsc'),
  },
  {
    icon: 'mdi-sort-alphabetical-descending',
    value: { field: 'username', order: 'desc' },
    translate: path('sortList.usernameDesc'),
  },
  {
    icon: 'mdi-sort-calendar-ascending',
    value: { field: 'createdAt', order: 'asc' },
    translate: path('sortList.createdAtAsc'),
  },
  {
    icon: 'mdi-sort-calendar-descending',
    value: { field: 'createdAt', order: 'desc' },
    translate: path('sortList.createdAtDesc'),
  },
  {
    icon: 'mdi-sort-clock-ascending-outline',
    value: { field: 'updatedAt', order: 'asc' },
    translate: path('sortList.updatedAtAsc'),
  },
  {
    icon: 'mdi-sort-clock-descending-outline',
    value: { field: 'updatedAt', order: 'desc' },
    translate: path('sortList.updatedAtDesc'),
  },
];

const {
  excute: refetchRoles,
  isLoading: isLoadingRoles,
  data: roles,
} = useAxios(services.roles, 'getAll', {
  immediate: true,
  paramsOrData: {},
});

const roleList = computed<
  Array<{ id: string; name: string; default: boolean }>
>(() =>
  roles.value
    ? _.map(roles.value, (role) => _.pick(role, ['id', 'name', 'default']))
    : [],
);

const { form, reset, setRouteQuery } = useSearchForm<ISearchUsersRequest>(
  {
    username: null,
    name: null,
    email: null,
    emailStates: [],
    roleIds: [],
    roleMode: null,
    sort: null,
    skip: Router.SKIP_DEFAULT,
    take: Router.TAKE_DEFAULT,
  },
  {
    decodeQuery: (query) => ({
      username: Router.getQuery(query.username),
      name: Router.getQuery(query.name),
      email: Router.getQuery(query.email),
      emailStates: Router.getQueryAll(query.emailStates),
      roleIds: Router.getQueryAll(query.roleIds),
      roleMode: Router.getQuery(query.roleMode),
      sort:
        Router.getQuery(query['sort[field]']) &&
        Router.getQuery(query['sort[order]'])
          ? {
              field: Router.getQuery(query['sort[field]'])!,
              order: Router.getQuery(query['sort[order]'])!,
            }
          : null,
      skip: Router.getQuery(query.skip) ?? '0',
      take: Router.getQuery(query.take) ?? '10',
    }),
    encodeQuery: (form) => ({
      ...form,
      sort: undefined,
      ...(form.sort
        ? {
            ['sort[field]']: form.sort.field!,
            ['sort[order]']: form.sort.order!,
          }
        : {}),
    }),
  },
);

const [v$, { isLoading: isLoadingForm }] = useVuelidate<ISearchUsersRequest>(
  {
    username: { maxLength: maxLength(pathFormField('username'), 255) },
    name: { maxLength: maxLength(pathFormField('name'), 255) },
    email: { maxLength: maxLength(pathFormField('email'), 450) },
    emailStates: {},
    roleIds: {},
    roleMode: {},
    sort: {},
  },
  form,
);

const { excute: refetchUsers, data } = useAxios(services.users, 'getAll');

async function onReset() {
  await refetchRoles({});
  v$.value.$reset();
  reset();
}

async function onSubmit(pagination: boolean = false) {
  await v$.value.$validate();
  if (v$.value.$invalid) {
    return;
  }

  if (!pagination) {
    form.skip = Router.SKIP_DEFAULT;
  }

  const params = Router.parseSearchForm(form);
  setRouteQuery();
  await refetchUsers(params);
}

const onSubmitThrottle = useThrottleFn(
  async (pagination: boolean = false) => {
    await onSubmit(pagination);
  },
  1000,
  true,
);
onSubmitThrottle();

watch(
  [() => form.roleIds?.length, () => form.roleMode, () => form.sort],
  () => {
    form.skip = Router.SKIP_DEFAULT;
    onSubmitThrottle();
  },
);
watch([() => form.skip, () => form.take], () => {
  onSubmitThrottle(true);
});

const { openDialog, closeDialog, isActiveDialog } = useRouterDialog({
  name: 'Dashboard:Users',
  param: 'dialog',
});

const dialogs = {
  changeRoles: {
    component: defineAsyncComponent(
      () => import('@/components/Dashboard/Dialogs/DialogChangeUserRoles.vue'),
    ),
    onSubmit: async () => {
      setTimeout(() => onSubmit(true), 250);
    },
  },
};

provide(KEYS.DASHBOARD.USERS.DIALOGS.CHANGE_ROLES.ROLE_LIST, roleList);
provide(KEYS.DASHBOARD.USERS.DIALOGS.CHANGE_ROLES.OPEN_DIALOG, (id: string) => {
  openDialog('changeRoles', { params: { id } });
});

const isLoading = computed(() => isLoadingRoles.value || isLoadingForm.value);
</script>
