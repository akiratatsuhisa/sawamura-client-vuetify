<template>
  <v-main>
    <v-container class="fill-height">
      <v-row>
        <v-col class="mx-auto" cols="12" md="6">
          <v-card class="text-center">
            <v-card-text>
              <v-icon icon="mdi-alert-circle" color="error" size="128" />
            </v-card-text>
            <v-card-title tag="h1">
              <span class="text-error">500</span>
              Internal Server
            </v-card-title>
            <v-card-subtitle tag="h2">
              Sorry, something went wrong.
            </v-card-subtitle>
            <v-card-text>
              <v-btn variant="tonal" :to="{ name: 'Home' }">Back Home</v-btn>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>
