<template>
  <v-card flat>
    <v-card-title>{{ translate('title') }}</v-card-title>
    <v-card-text class="px-2 px-md-4">
      <form @submit.prevent="onSubmit">
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
      <v-menu-chip
        v-model="v$.sort.$model"
        icon="mdi-sort"
        :label="translateFormField('sort')"
        :items="sortList"
      />
      <v-chip-group
        filter
        multiple
        class="d-inline"
        v-model="v$.roleIds.$model"
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
    </v-card-text>
    <v-card-text tag="pre">
      {{ form }}
    </v-card-text>
    <v-card-text v-if="data">
      {{ data.totalCount }}
      <pre>{{ data.records }}</pre>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import _ from 'lodash';
import { computed, watch } from 'vue';

import VMenuChip from '@/components/VMenuChip.vue';
import VSegmentedButton from '@/components/VSegmentedButton.vue';
import {
  getErrorMessage,
  parseSearchForm,
  useAxios,
  usePageLocale,
  useSearchForm,
  useVuelidate,
} from '@/composables';
import { ISearchAdvancedUsersRequest } from '@/interfaces';
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

const { form, reset } = useSearchForm<ISearchAdvancedUsersRequest>({
  username: null,
  name: null,
  email: null,
  emailStates: [],
  roleIds: [],
  sort: null,
});

const [v$, { handleSubmit, isLoading: isLoadingForm }] =
  useVuelidate<ISearchAdvancedUsersRequest>(
    {
      username: { maxLength: maxLength(pathFormField('username'), 255) },
      name: { maxLength: maxLength(pathFormField('name'), 255) },
      email: { maxLength: maxLength(pathFormField('email'), 450) },
      emailStates: {},
      roleIds: {},
      sort: {},
    },
    form,
  );

const { excute: refetchUsers, data } = useAxios(
  services.users,
  'searchAdvanced',
);

async function onReset() {
  await refetchRoles({});
  v$.value.$reset();
  reset();
}

const onSubmit = handleSubmit(async (values) => {
  const params = parseSearchForm(values);
  await refetchUsers(params);
});

async function search() {
  await v$.value.$validate();

  if (v$.value.$invalid) {
    return;
  }

  const params = parseSearchForm(form);
  await refetchUsers(params);
}
search();

watch([() => form.roleIds?.length, () => form.sort], () => search());

const isLoading = computed(() => isLoadingRoles.value || isLoadingForm.value);
</script>

<style lang="scss"></style>
