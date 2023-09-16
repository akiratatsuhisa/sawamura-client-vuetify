<template>
  <v-drawer-navigation v-if="$vuetify.display.smAndUp" />
</template>

<script lang="ts" setup>
import VDrawerNavigation from '@/layouts/Default/components/DrawerNavigation.vue';
</script>
