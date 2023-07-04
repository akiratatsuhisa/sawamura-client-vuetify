<template>
  <router-view></router-view>

  <v-alerts-container />
  <v-snackbars-container />
</template>

<script setup lang="ts">
import VAlertsContainer from '@/components/VAlertsContainer.vue';
import VSnackbarsContainer from '@/components/VSnackbarsContainer.vue';
</script>
