<template>
  <v-btn
    color="tertiary"
    variant="tonal"
    :loading="isLoading"
    @click="() => excute({})"
  >
    Export Pdf
  </v-btn>
  <a ref="downloadRef" hidden download="profile.pdf"></a>
</template>

<script lang="ts" setup>
import { useObjectUrl } from '@vueuse/core';
import _ from 'lodash';
import { ref, watch } from 'vue';

import { useAxios } from '@/composables';
import { services } from '@/services';

const { data, excute, isLoading } = useAxios(services.auth, 'exportProfilePdf');

const src = useObjectUrl(data);

const downloadRef = ref<HTMLLinkElement>();

watch(src, (src) => {
  if (!src || !downloadRef.value) {
    return;
  }

  downloadRef.value.href = src;
  downloadRef.value.click();
});
</script>
