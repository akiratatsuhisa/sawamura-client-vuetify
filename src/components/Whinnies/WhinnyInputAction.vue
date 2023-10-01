<template>
  <v-btn
    icon
    color="primary"
    size="x-small"
    variant="text"
    @click.stop="emit('click', $event)"
  >
    <v-icon :icon="icon" size="x-large" />
  </v-btn>
</template>

<script lang="ts" setup>
defineProps<{ icon: string; value?: number }>();

const emit = defineEmits<{ (event: 'click', payload: Event): void }>();
</script>
