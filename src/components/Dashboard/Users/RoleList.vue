<template>
  <v-card flat>
    <v-card-text class="d-flex justify-space-between align-baseline">
      <h3 class="text-subtitle-1 d-inline">
        Total roles:
        <strong class="text-tertiary">{{ roles?.length ?? 0 }}</strong>
      </h3>

      <v-btn
        prepend-icon="mdi-content-save"
        :loading="isLoading"
        @click="action = { mode: 'create' }"
      >
        Create
      </v-btn>
    </v-card-text>

    <v-divider></v-divider>

    <v-list lines="one" ref="sortableRef">
      <v-role-item
        v-for="role in roles"
        :key="role.id"
        :value="role"
        :loading="isLoading"
        @action="(value) => (action = value)"
      >
        {{ role.name }}
      </v-role-item>
    </v-list>

    <v-dialog-create-role
      :model-value="action?.mode === 'create'"
      @update:model-value="closeDialog"
      @submit="requestCreateRole"
    />

    <v-dialog-update-role
      :value="action?.value"
      :model-value="action?.mode === 'update'"
      @update:model-value="closeDialog"
      @submit="requestUpdateRole"
    />

    <v-dialog-delete-role
      :value="action?.value"
      :model-value="action?.mode === 'delete'"
      @update:model-value="closeDialog"
      @submit="requestDeleteRole"
    />
  </v-card>
</template>

<script lang="ts" setup>
import { useSortable } from '@vueuse/integrations/useSortable';
import { computed, defineAsyncComponent, onMounted, ref } from 'vue';

import VRoleItem from '@/components/Dashboard/Users/RoleItem.vue';
import {
  useAxios,
  useSocketDashboard,
  useSocketEventListener,
} from '@/composables';
import { IRoleResponse } from '@/interfaces';
import { services } from '@/services';

const VDialogCreateRole = defineAsyncComponent(
  () => import('@/components/Dashboard/Dialogs/DialogCreateRole.vue'),
);
const VDialogDeleteRole = defineAsyncComponent(
  () => import('@/components/Dashboard/Dialogs/DialogDeleteRole.vue'),
);
const VDialogUpdateRole = defineAsyncComponent(
  () => import('@/components/Dashboard/Dialogs/DialogUpdateRole.vue'),
);

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

useSortable(sortableRef, roles, {
  handle: '.handle',
  onStart,
  onEnd,
});

const action = ref<
  | {
      mode: 'create';
      value?: undefined;
    }
  | {
      mode: 'update' | 'delete';
      value: IRoleResponse;
    }
>();

function closeDialog() {
  action.value = undefined;
}

const { excute: requestCreateRole, isLoading: isLoadingCreateRole } = useAxios(
  services.roles,
  'create',
  { message: 'Create Role Completed' },
);

const { excute: requestUpdateRole, isLoading: isLoadingUpdateRole } = useAxios(
  services.roles,
  'update',
  { message: 'Update Role Completed' },
);

const { excute: requestDeleteRole, isLoading: isLoadingDeleteRole } = useAxios(
  services.roles,
  'delete',
  { message: 'Delete Role Completed' },
);

const isLoading = computed(
  () =>
    isLoadingCreateRole.value ||
    isLoadingUpdateRole.value ||
    isLoadingDeleteRole.value,
);
</script>
