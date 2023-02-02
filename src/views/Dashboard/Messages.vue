<template>
  <h2>Messages</h2>
  <v-btn :loading="percent === 0 && isLoading" @click="excute">
    <template v-if="isLoading">
      <v-progress-circular :size="26" :width="2" :model-value="percent">
        <span class="text-overline">{{ Math.round(percent) }}</span>
      </v-progress-circular>
    </template>
    <template v-else> Test </template>
  </v-btn>
</template>

<script lang="ts" setup>
import { useAxios } from "@/composables/useAxios";
import { services } from "@/services";

const { excute, isLoading, percent } = useAxios(services.todos, "getAll");
</script>
