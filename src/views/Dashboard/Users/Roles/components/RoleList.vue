<template>
  <v-list lines="one" ref="sortableRef">
    <v-role-list-item
      v-for="role in roles"
      :key="role.id"
      :value="role"
      :loading="loading"
      @action="$emit('action', $event)"
    >
      {{ role.name }}
    </v-role-list-item>
  </v-list>
</template>

<script lang="ts" setup>
import { inject } from 'vue';

import { KEYS } from '@/constants';
import { IRoleResponse } from '@/interfaces';
import VRoleListItem from '@/views/Dashboard/Users/Roles/components/RoleListItem.vue';

defineProps<{ roles: Array<IRoleResponse>; loading: boolean }>();

defineEmits<{
  (
    event: 'action',
    value: { mode: 'update' | 'delete'; value: IRoleResponse },
  ): void;
}>();

const sortableRef = inject(KEYS.DASHBOARD.USERS.ROLES.SOFTABLE_REF)!;
</script>
