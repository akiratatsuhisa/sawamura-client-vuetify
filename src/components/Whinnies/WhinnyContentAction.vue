<template>
  <div class="d-flex align-center" @click.stop="emit('click', $event)">
    <v-btn icon :color="color" size="x-small" variant="text">
      <v-icon :icon="icon" size="x-large" />
    </v-btn>

    <v-hover #default="{ props, isHovering }">
      <div
        v-bind="props"
        class="font-weight-medium text-medium-emphasis prevent-select"
        :class="{ [`text-${color}`]: isHovering }"
      >
        {{ value }}
      </div>
    </v-hover>
  </div>
</template>

<script lang="ts" setup>
withDefaults(defineProps<{ icon: string; value?: number; color?: string }>(), {
  color: 'primary',
});

const emit = defineEmits<{ (event: 'click', payload: Event): void }>();
</script>
