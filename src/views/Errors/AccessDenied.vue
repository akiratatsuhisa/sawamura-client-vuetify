<template>
  <v-main>
    <v-container class="fill-height">
      <v-row>
        <v-col class="mx-auto" cols="12" md="6">
          <v-card class="text-center">
            <v-card-text>
              <v-icon icon="mdi-alert" color="warning" size="128" />
            </v-card-text>
            <v-card-title tag="h1">
              <span class="text-warning">403</span>
              Access Denied
            </v-card-title>
            <v-card-subtitle tag="h2">
              Sorry, you are not authorized to access this page.
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
