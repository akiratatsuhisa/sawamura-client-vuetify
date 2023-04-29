<template>
  <v-card flat>
    <v-card-text class="d-flex justify-space-between align-baseline">
      <h3 class="text-subtitle-1 d-inline">
        Total roles:
        <strong class="text-tertiary">{{ roles?.length ?? 0 }}</strong>
      </h3>

      <v-btn
        variant="tonal"
        prepend-icon="mdi-content-save"
        :loading="isLoading"
        @click="action = { mode: 'create' }"
      >
        Create
      </v-btn>
    </v-card-text>

    <v-divider></v-divider>

    <v-list lines="one">
      <draggable
        v-model="roles"
        item-key="id"
        handle=".handle"
        ghost-class="elevation-6"
        @end="onEnd"
        @start="onStart"
      >
        <template #item="{ element }">
          <role-item
            :value="element"
            :loading="isLoading"
            @action="(value) => (action = value)"
          ></role-item>
        </template>
      </draggable>
    </v-list>

    <dialog-create-role
      :model-value="action?.mode === 'create'"
      @update:model-value="closeDialog"
      @submit="requestCreateRole"
    />

    <dialog-update-role
      :value="action?.value"
      :model-value="action?.mode === 'update'"
      @update:model-value="closeDialog"
      @submit="requestUpdateRole"
    />

    <dialog-delete-role
      :value="action?.value"
      :model-value="action?.mode === 'delete'"
      @update:model-value="closeDialog"
      @submit="requestDeleteRole"
    />
  </v-card>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import draggable from 'vuedraggable';

import DialogCreateRole from '@/components/Dashboard/Dialogs/DialogCreateRole.vue';
import DialogDeleteRole from '@/components/Dashboard/Dialogs/DialogDeleteRole.vue';
import DialogUpdateRole from '@/components/Dashboard/Dialogs/DialogUpdateRole.vue';
import RoleItem from '@/components/Dashboard/Users/RoleItem.vue';
import { useAxios } from '@/composables/useAxios';
import { useSocketDashboard } from '@/composables/useSocketDashboard';
import { useSocketEventListener } from '@/composables/useSocketEventListener';
import { IRoleResponse } from '@/interfaces/roles';
import { services } from '@/services';

const socket = useSocketDashboard();

const { data: roles } = useAxios(services.roles, 'getAll', {
  immediate: true,
  paramsOrData: {},
});

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
);

const { excute: requestUpdateRole, isLoading: isLoadingUpdateRole } = useAxios(
  services.roles,
  'update',
);

const { excute: requestDeleteRole, isLoading: isLoadingDeleteRole } = useAxios(
  services.roles,
  'delete',
);

const isLoading = computed(
  () =>
    isLoadingCreateRole.value ||
    isLoadingUpdateRole.value ||
    isLoadingDeleteRole.value,
);
</script>
