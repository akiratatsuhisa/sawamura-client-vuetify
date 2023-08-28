<template>
  <video class="video d-block" controls>
    <source :src="fileSrc" />
  </video>
</template>

<script lang="ts" setup>
import _ from 'lodash';

defineProps<{
  fileSrc?: string;
}>();
</script>

<style lang="scss" scoped>
video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
