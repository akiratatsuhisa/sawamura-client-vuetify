<template>
  <v-card flat>
    <v-card-text class="d-flex justify-space-between align-baseline">
      <i18n-t
        :keypath="path('subtitle')"
        tag="h3"
        scope="global"
        class="text-subtitle-1 d-inline"
      >
        <strong class="text-tertiary">{{ roles?.length ?? 0 }}</strong>
      </i18n-t>

      <v-btn
        prepend-icon="mdi-content-save"
        :loading="isLoading"
        @click="openDialog('create')"
      >
        {{ translate('actions.create') }}
      </v-btn>
    </v-card-text>
    <v-divider />

    <v-role-list
      :roles="roles"
      :loading="isLoading"
      @action="
        (data) => openDialog(data.mode, { params: { id: data.value.id } })
      "
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
import { useSortable } from '@vueuse/integrations/useSortable';
import { computed, defineAsyncComponent, onMounted, provide, ref } from 'vue';

import {
  useAxios,
  usePageLocale,
  useRouterDialog,
  useSocketDashboard,
  useSocketEventListener,
} from '@/composables';
import { KEYS } from '@/constants';
import { IRoleResponse } from '@/interfaces';
import { services } from '@/services';
import VRoleList from '@/views/Dashboard/Users/Roles/components/RoleList.vue';

const { path, translate } = usePageLocale({ prefix: 'dashboard.users.roles' });

const socket = useSocketDashboard();

const roles = ref<Array<IRoleResponse>>([]);

const { excute: requestRoles } = useAxios(services.roles, 'getAll');

onMounted(async () => (roles.value = await requestRoles({})));

useSocketEventListener<{ roles: Array<IRoleResponse> }>(socket, 'list:role', {
  listener({ roles: data }) {
    roles.value = data;
  },
});

const { excute: requestSortRole } = useAxios(services.roles, 'sort');

const draggedRole = ref<IRoleResponse>();

function onStart({ oldIndex }: { oldIndex: number }) {
  draggedRole.value = roles.value?.[oldIndex];
}

function onEnd({ newIndex }: { newIndex: number }) {
  const sort = newIndex + 1;

  requestSortRole({
    id: draggedRole.value!.id,
    sort,
  });

  draggedRole.value = undefined;
}

const sortableRef = ref<HTMLDivElement>();
provide(KEYS.DASHBOARD.USERS.ROLES.SOFTABLE_REF, sortableRef);

useSortable(sortableRef, roles, {
  handle: '.handle',
  onStart,
  onEnd,
});

const { excute: requestCreateRole, isLoading: isLoadingCreateRole } = useAxios(
  services.roles,
  'create',
  { message: computed(() => translate('messages.create')) },
);

const { excute: requestUpdateRole, isLoading: isLoadingUpdateRole } = useAxios(
  services.roles,
  'update',
  { message: computed(() => translate('messages.update')) },
);

const { excute: requestDeleteRole, isLoading: isLoadingDeleteRole } = useAxios(
  services.roles,
  'delete',
  { message: computed(() => translate('messages.delete')) },
);

const { openDialog, closeDialog, isActiveDialog } = useRouterDialog({
  name: 'Dashboard:Users:Roles',
  param: 'dialog',
});

const dialogs = {
  create: {
    component: defineAsyncComponent(
      () =>
        import('@/views/Dashboard/Users/Roles/components/DialogCreateRole.vue'),
    ),
    onSubmit: requestCreateRole,
  },
  update: {
    component: defineAsyncComponent(
      () =>
        import('@/views/Dashboard/Users/Roles/components/DialogUpdateRole.vue'),
    ),
    onSubmit: requestUpdateRole,
  },
  delete: {
    component: defineAsyncComponent(
      () =>
        import('@/views/Dashboard/Users/Roles/components/DialogDeleteRole.vue'),
    ),
    onSubmit: requestDeleteRole,
  },
};

const isLoading = computed(
  () =>
    isLoadingCreateRole.value ||
    isLoadingUpdateRole.value ||
    isLoadingDeleteRole.value,
);
</script>
