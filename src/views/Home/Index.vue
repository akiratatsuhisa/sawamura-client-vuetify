<template>
  <v-main class="bg-surface-container">
    <v-container fluid class="fill-height text-center">
      <v-responsive
        class="rounded-lg bg-surface h-100 d-flex align-center justify-center"
      >
        <HelloWorld />
      </v-responsive>
    </v-container>
  </v-main>
</template>

<script lang="ts" setup>
import HelloWorld from '@/views/Home/components/HelloWorld.vue';
</script>
