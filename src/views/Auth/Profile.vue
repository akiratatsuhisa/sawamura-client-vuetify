<template>
  <v-main>
    <v-container>
      <v-row>
        <v-col md="8" lg="6" class="mx-auto">
          <v-card tag="h1">
            <v-img
              aspect-ratio="16/9"
              cover
              src="https://cdn.vuetifyjs.com/images/parallax/material.jpg"
            >
            </v-img>
            <v-sheet>
              <v-sheet class="d-flex">
                <v-avatar
                  image="https://randomuser.me/api/portraits/men/85.jpg"
                  size="80"
                  rounded="0"
                  class="mx-2 mt-n12"
                >
                </v-avatar>
                <v-card-title tag="h2" class="flex-grow-1">
                  {{ user?.lastName }} {{ user?.firstName }}
                </v-card-title>
              </v-sheet>

              <v-card-subtitle tag="h1">
                Username - {{ user?.username }}
              </v-card-subtitle>
              <v-card-actions>
                <h3 class="text-body-1 font-weight-medium mx-4">Info</h3>
                <v-spacer></v-spacer>
                <v-btn
                  append-icon="mdi-account-edit-outline"
                  variant="elevated"
                >
                  Edit profile
                </v-btn>
              </v-card-actions>
              <v-divider></v-divider>
              <v-card-text>
                <v-list>
                  <v-list-item prepend-icon="mdi-email">
                    <v-list-item-title>Email</v-list-item-title>
                    <v-list-item-subtitle>
                      {{ user?.email }}
                    </v-list-item-subtitle>
                  </v-list-item>

                  <v-list-item prepend-icon="mdi-cake">
                    <v-list-item-title>Dob</v-list-item-title>
                    <v-list-item-subtitle>
                      {{ Format.date(user?.birthDate) }}
                    </v-list-item-subtitle>
                  </v-list-item>

                  <v-list-item prepend-icon="mdi-currency-usd">
                    <v-list-item-title>Salary</v-list-item-title>
                    <v-list-item-subtitle>
                      {{ Format.currency(user?.salary) }}
                    </v-list-item-subtitle>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-sheet>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script lang="ts" setup>
import { onBeforeMount, ref } from 'vue';

import { useAuth } from '@/composables/useAuth';
import { Format } from '@/helpers/format';
import { IdentityUser } from '@/interfaces/auth';

const { getUserSilently } = useAuth();

const user = ref<IdentityUser | null>(null);

onBeforeMount(async () => {
  user.value = await getUserSilently();
});
</script>
