<template>
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
      <v-sheet class="mb-3 d-flex bg-surface-container-low text-on-surface">
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
              />

              <v-overlay
                :model-value="isHovering"
                contained
                class="align-center justify-center"
              >
                <v-avatar color="secondary-container">
                  <v-icon icon="mdi-image-edit" size="28" />
                </v-avatar>
              </v-overlay>
            </v-avatar>
          </template>
        </v-hover>

        <v-card-title tag="h2" class="flex-grow-1 pl-0">
          {{ user.lastName }} {{ user.firstName }}
        </v-card-title>
      </v-sheet>

      <v-card-subtitle tag="h1">
        Username - {{ user.username }}
      </v-card-subtitle>
    </v-sheet>
  </v-card>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

import { useUser } from '@/composables';
import { IAdvancedUserResponse } from '@/interfaces';

const LAZY_BACKGROUND = import.meta.env.VITE_NO_BACKGROUND_URL;

const props = defineProps<{ user: IAdvancedUserResponse }>();

const { coverUrl, photoUrl } = useUser(computed(() => props.user));
</script>
