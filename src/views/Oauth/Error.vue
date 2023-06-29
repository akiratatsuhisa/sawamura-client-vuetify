<template>
  <v-container class="fill-height">
    <v-row class="h-100 align-content-center">
      <v-col class="mx-auto" md="6" lg="4">
        <v-card>
          <v-card-title>Oauth Login</v-card-title>
          <v-card-subtitle class="text-wrap">
            Has an error when Oauth, please try again
          </v-card-subtitle>
          <v-card-text>
            <v-btn
              type="submit"
              :to="{ name: 'Login' }"
              variant="elevated"
              block
              class="mb-3"
            >
              Login Page
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup></script>
