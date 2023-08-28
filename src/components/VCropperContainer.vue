<template>
  <div
    class="d-flex justify-center align-center"
    :class="[backgroundSrc ? 'rounded-lg' : 'rounded-xl']"
    :style="{ height: $vuetify.display.smAndDown ? '' : height }"
  >
    <div
      :style="{ backgroundImage: 'url(' + backgroundSrc + ')' }"
      class="image-background"
    ></div>
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
defineProps<{ backgroundSrc?: string; height?: string }>();
</script>
