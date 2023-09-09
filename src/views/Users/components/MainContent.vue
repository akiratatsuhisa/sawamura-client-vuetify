<template>
  <v-card
    v-for="index in 10"
    :key="index"
    :rounded="$vuetify.display.smAndDown ? '0' : 'xl'"
    :variant="$vuetify.display.smAndDown ? 'flat' : 'elevated'"
    :class="[
      $vuetify.display.smAndDown
        ? 'bg-transparent'
        : 'bg-surface-container-low text-on-surface my-4',
    ]"
  >
    <v-card-text>Main Content</v-card-text>
    <v-card-text>
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repudiandae,
      quae beatae expedita, libero nulla nesciunt earum quia ut cumque maiores
      eius consequatur natus id, distinctio ea voluptate unde nam pariatur.
    </v-card-text>
    <v-divider v-if="$vuetify.display.smAndDown" />
  </v-card>
</template>
