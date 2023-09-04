<template>
  <v-main>
    <v-container>
      <v-row>
        <v-col cols="12" lg="10" class="mx-auto">
          <v-card rounded="xl">
            <v-img
              aspect-ratio="16/9"
              cover
              :lazy-src="LAZY_BACKGROUND"
              :src="coverUrl"
              class="elevation-4 rounded-xl"
            >
            </v-img>

            <v-sheet class="bg-surface-container-low text-on-surface">
              <v-sheet
                class="mb-3 d-flex bg-surface-container-low text-on-surface"
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
                          @click="openDialog('photo')"
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
                  @click="openDialog('edit')"
                >
                  Edit Profile
                </v-btn>

                <v-btn
                  v-if="isThemeSelectable"
                  prepend-icon="mdi-palette"
                  variant="elevated"
                  size="small"
                  class="mr-md-2 mb-2 mb-md-0"
                  @click="openDialog('theme')"
                >
                  Select Theme
                </v-btn>

                <v-btn
                  prepend-icon="mdi-image-edit"
                  variant="elevated"
                  size="small"
                  class="mb-2 mb-md-0"
                  @click="openDialog('cover')"
                >
                  Change Cover
                </v-btn>
              </v-card-text>

              <v-divider />

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

  <template v-for="(dialog, name) in dialogs" :key="name">
    <component
      :is="dialog.component"
      :model-value="isActiveDialog(name)"
      @update:model-value="closeDialog"
    />
  </template>
</template>

<script lang="ts" setup>
import { useStyleTag } from '@vueuse/core';
import { computed, defineAsyncComponent, onBeforeMount } from 'vue';

import VExportPdfBtn from '@/components/Auth/Profile/ExportPdf.vue';
import { useAuth, useRouterDialog, useThemeModeStorage } from '@/composables';
import { Format } from '@/helpers';

const LAZY_BACKGROUND = import.meta.env.VITE_NO_BACKGROUND_URL;

const { user, photoUrl, coverUrl, getUserSilently } = useAuth();
const { isThemeSelectable } = useThemeModeStorage();

const { isActiveDialog, openDialog, closeDialog } = useRouterDialog({
  name: 'Users:Profile',
  param: 'dialog',
});

const dialogs = {
  photo: {
    component: defineAsyncComponent(
      () => import('@/components/Auth/Dialogs/DialogProfilePhoto.vue'),
    ),
  },
  cover: {
    component: defineAsyncComponent(
      () => import('@/components/Auth/Dialogs/DialogProfileCover.vue'),
    ),
  },
  theme: {
    component: defineAsyncComponent(
      () => import('@/components/Auth/Dialogs/DialogProfileTheme.vue'),
    ),
  },
  edit: {
    component: defineAsyncComponent(
      () => import('@/components/Auth/Dialogs/DialogProfileEdit.vue'),
    ),
  },
};

onBeforeMount(async () => {
  await getUserSilently();
});

useStyleTag(
  computed(() => user.value?.themeStyle ?? ''),
  { id: 'vuetify-auth-profile-style' },
);
</script>
