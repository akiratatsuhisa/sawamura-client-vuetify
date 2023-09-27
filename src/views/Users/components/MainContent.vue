<template>
  <v-sheet
    v-for="index in 10"
    :key="index"
    v-ripple
    class="cursor-pointer"
    :class="[$vuetify.display.smAndUp ? 'my-4' : '']"
    :rounded="$vuetify.display.xs ? '0' : 'xl'"
    @click="
      $router.push({
        name: 'Users:Status',
        params: { id: index + 1, username: route.params.username },
      })
    "
  >
    <v-card-text>Main Content</v-card-text>
    <v-card-text>
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repudiandae,
      quae beatae expedita, libero nulla nesciunt earum quia ut cumque maiores
      eius consequatur natus id, distinctio ea voluptate unde nam pariatur.
    </v-card-text>
    <v-divider v-if="$vuetify.display.xs" />
  </v-sheet>
</template>

<script lang="ts" setup>
import { useBackgroundRoute } from '@/composables';

const route = useBackgroundRoute();
</script>
