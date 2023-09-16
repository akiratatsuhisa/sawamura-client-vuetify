<template>
  <v-sheet
    v-for="index in 10"
    :key="index"
    :rounded="$vuetify.display.xs ? '0' : 'xl'"
    :class="[$vuetify.display.smAndUp ? 'my-4' : '']"
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
