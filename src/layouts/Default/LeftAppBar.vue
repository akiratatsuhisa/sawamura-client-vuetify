<template>
  <v-rail-navigation v-if="$vuetify.display.smAndUp" />
  <v-drawer-navigation v-if="$vuetify.display.xs" />
</template>

<script lang="ts" setup>
import VDrawerNavigation from '@/layouts/Default/components/DrawerNavigation.vue';
import VRailNavigation from '@/layouts/Default/components/RailNavigation.vue';
</script>
