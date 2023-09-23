<template>
  <div class="fill-height d-flex align-center justify-center">
    <v-progress-circular size="88" width="6" color="primary" indeterminate />
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';

const router = useRouter();

router.push({ name: 'Home' });
</script>
