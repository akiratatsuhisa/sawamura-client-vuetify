<template>
  <router-view></router-view>

  <v-snackbars-container />
  <v-alerts-container />
</template>

<script setup lang="ts">
import VAlertsContainer from '@/components/VAlertsContainer.vue';
import VSnackbarsContainer from '@/components/VSnackbarsContainer.vue';
</script>
