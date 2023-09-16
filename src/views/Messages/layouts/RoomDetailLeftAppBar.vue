<template>
  <v-rail-navigation v-if="$vuetify.display.mdAndUp" />
</template>

<script lang="ts" setup>
import VRailNavigation from '@/layouts/Default/components/RailNavigation.vue';
</script>
