<template>
  <v-main>
    <v-container>
      <v-row>
        <v-col md="8" lg="6" class="mx-auto">
          <v-card>
            <v-img
              aspect-ratio="16/9"
              cover
              :lazy-src="LAZY_BACKGROUND"
              :src="coverUrl"
              class="elevation-4"
            >
            </v-img>

            <v-sheet class="bg-surface-variant text-on-surface-variant">
              <v-sheet
                class="mb-3 d-flex bg-surface-variant text-on-surface-variant"
              >
                <v-hover>
                  <template v-slot="{ isHovering, props }">
                    <v-avatar
                      size="96"
                      class="mx-2 mt-n12"
                      :class="[isHovering ? 'elevation-12' : 'elevation-6']"
                      v-bind="props"
                    >
                      <v-avatar
                        color="secondary-container"
                        class="elevation-6 cursor-none"
                        size="96"
                        :image="photoUrl"
                      >
                      </v-avatar>

                      <v-overlay
                        :model-value="isHovering"
                        contained
                        class="align-center justify-center"
                      >
                        <v-avatar
                          color="secondary-container"
                          @click="$router.push({ name: 'Profile:Photo' })"
                        >
                          <v-icon icon="mdi-image-edit" size="28" />
                        </v-avatar>
                      </v-overlay>
                    </v-avatar>
                  </template>
                </v-hover>

                <v-card-title tag="h2" class="flex-grow-1 pl-0">
                  {{ user?.lastName }} {{ user?.firstName }}
                </v-card-title>
              </v-sheet>

              <v-card-subtitle tag="h1">
                Username - {{ user?.username }}
              </v-card-subtitle>

              <v-card-text class="d-flex flex-column-reverse flex-md-row">
                <h3 class="text-body-1 font-weight-medium mx-4">Info</h3>

                <v-spacer></v-spacer>

                <v-btn
                  prepend-icon="mdi-account-edit-outline"
                  variant="elevated"
                  size="small"
                  class="mr-md-2 mb-2 mb-md-0"
                  @click="$router.push({ name: 'Profile:Edit' })"
                >
                  Edit Profile
                </v-btn>

                <v-btn
                  prepend-icon="mdi-palette"
                  variant="elevated"
                  size="small"
                  class="mr-md-2 mb-2 mb-md-0"
                  @click="$router.push({ name: 'Profile:Theme' })"
                >
                  Select Theme
                </v-btn>

                <v-btn
                  prepend-icon="mdi-image-edit"
                  variant="elevated"
                  size="small"
                  class="mb-2 mb-md-0"
                  @click="$router.push({ name: 'Profile:Cover' })"
                >
                  Change Cover
                </v-btn>
              </v-card-text>

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

              <v-card-actions class="justify-end">
                <v-export-pdf-btn />
              </v-card-actions>
            </v-sheet>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-main>

  <v-dialog-profile-photo
    :model-value="route.name === 'Profile:Photo'"
    @update:model-value="$router.push({ name: 'Profile' })"
  />
  <v-dialog-profile-cover
    :model-value="route.name === 'Profile:Cover'"
    @update:model-value="$router.push({ name: 'Profile' })"
  />
  <v-dialog-profile-theme
    :model-value="route.name === 'Profile:Theme'"
    @update:model-value="$router.push({ name: 'Profile' })"
  />
  <v-dialog-profile-edit
    :model-value="route.name === 'Profile:Edit'"
    @update:model-value="$router.push({ name: 'Profile' })"
  />
</template>

<script lang="ts" setup>
import { useStyleTag } from '@vueuse/core';
import { computed, defineAsyncComponent, onBeforeMount } from 'vue';
import { useRoute } from 'vue-router';

import VExportPdfBtn from '@/components/Auth/Profile/ExportPdf.vue';
import { useAuth } from '@/composables';
import { Format } from '@/helpers';

const VDialogProfileCover = defineAsyncComponent(
  () => import('@/components/Auth/Dialogs/DialogProfileCover.vue'),
);
const VDialogProfileEdit = defineAsyncComponent(
  () => import('@/components/Auth/Dialogs/DialogProfileEdit.vue'),
);
const VDialogProfilePhoto = defineAsyncComponent(
  () => import('@/components/Auth/Dialogs/DialogProfilePhoto.vue'),
);
const VDialogProfileTheme = defineAsyncComponent(
  () => import('@/components/Auth/Dialogs/DialogProfileTheme.vue'),
);

const LAZY_BACKGROUND = import.meta.env.VITE_NO_BACKGROUND_URL;

const { user, photoUrl, coverUrl, getUserSilently } = useAuth();

const route = useRoute();

onBeforeMount(async () => {
  await getUserSilently();
});

useStyleTag(
  computed(() => user.value?.themeStyle ?? ''),
  { id: 'vuetify-auth-profile-style' },
);
</script>
