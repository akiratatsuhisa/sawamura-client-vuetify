<template>
  <v-main>
    <v-container class="fill-height">
      <v-row>
        <v-col class="mx-auto" cols="12" md="6">
          <v-card class="text-center">
            <v-card-text>
              <v-icon icon="mdi-help-circle" color="info" size="128" />
            </v-card-text>
            <v-card-title tag="h1">
              <span class="text-info">404</span>
              Not Found
            </v-card-title>
            <v-card-subtitle tag="h2">
              Sorry, the page you visited does not exist.
            </v-card-subtitle>
            <v-card-text>
              <v-btn :to="{ name: 'Home' }">Back Home</v-btn>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>
