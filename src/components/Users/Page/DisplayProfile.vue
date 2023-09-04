<template>
  <v-card
    rounded="xl"
    class="profile-page bg-surface-container-low text-on-surface"
  >
    <v-hover v-slot="{ isHovering, props: hoverProps }">
      <v-sheet
        color="transparent"
        class="position-relative rounded-xl"
        v-bind="hoverProps"
      >
        <v-img
          aspect-ratio="16/9"
          cover
          :lazy-src="LAZY_BACKGROUND"
          :src="props.coverUrl ?? coverUrl"
          class="elevation-4 rounded-xl"
        >
        </v-img>
        <v-overlay
          :model-value="isHovering"
          contained
          class="align-center justify-center"
        >
          <v-avatar
            color="secondary-container"
            @click="selectedImageSrc = props.coverUrl ?? coverUrl"
            size="48"
          >
            <v-icon icon="mdi-image-edit" />
          </v-avatar>
        </v-overlay>
      </v-sheet>
    </v-hover>

    <div class="px-3 pt-3 pb-2 pb-md-3 d-flex justify-space-between">
      <v-hover v-slot="{ isHovering, props: hoverProps }">
        <v-avatar
          size="96"
          class="avatar mx-0 mx-md-3"
          :class="[isHovering ? 'elevation-12' : 'elevation-6']"
          v-bind="hoverProps"
        >
          <v-avatar
            color="secondary-container"
            class="elevation-6 cursor-none"
            size="96"
            :image="props.photoUrl ?? photoUrl"
          />

          <v-overlay
            :model-value="isHovering"
            contained
            class="align-center justify-center"
          >
            <v-avatar
              color="secondary-container"
              @click="selectedImageSrc = props.photoUrl ?? photoUrl"
            >
              <v-icon icon="mdi-image-edit" />
            </v-avatar>
          </v-overlay>
        </v-avatar>
      </v-hover>

      <div v-if="$vuetify.display.mdAndUp" class="actions d-flex align-center">
        <slot name="actions"></slot>
      </div>
    </div>

    <div
      v-if="$vuetify.display.smAndDown"
      class="pl-5 pr-4 actions d-flex align-center"
    >
      <slot name="actions"></slot>
    </div>

    <v-card-title tag="h1" class="py-0">
      {{ user.displayName }}
    </v-card-title>
    <v-card-subtitle tag="h2">@{{ user.username }}</v-card-subtitle>
    <v-card-subtitle tag="h3" class="font-weight-medium">
      {{ user.firstName }} {{ user.lastName }}
    </v-card-subtitle>
    <v-card-text>
      <p v-if="user.biography" class="mb-3">
        {{ user.biography }}
      </p>

      <div class="profile">
        <div v-if="user.birthDate">
          <v-icon color="primary" icon="mdi-cake-variant-outline" />
          <span class="ml-1">
            {{ Format.date(user.birthDate, { dateStyle: 'long' }) }}
          </span>
        </div>
        <div v-if="user.location">
          <v-icon color="primary" icon="mdi-map-marker-radius" />
          <span class="ml-1">{{ user.location }}</span>
        </div>
        <div v-if="user.websiteLink">
          <v-icon color="primary" icon="mdi-link-variant" />
          <span class="ml-1">
            <a :href="user.websiteLink" target="_blank" class="text-primary">
              {{ user.websiteLink }}
            </a>
          </span>
        </div>
        <div>
          <v-icon color="primary" icon="mdi-calendar-month" />
          <span class="ml-1">
            {{ Format.date(user.createdAt, { dateStyle: 'long' }) }}
          </span>
        </div>
      </div>
    </v-card-text>
    <v-divider />
    <v-card-text class="py-1">
      <v-chip
        variant="outlined"
        rounded="lg"
        class="my-1 mr-2"
        @click="() => undefined"
      >
        <template #prepend>
          <v-icon icon="mdi-account-eye-outline" start color="primary" />
        </template>
        {{
          $t(
            'common.user.count.following',
            {
              count: user._count.followers,
            },
            user._count.followers,
          )
        }}
      </v-chip>
      <v-chip
        variant="outlined"
        rounded="lg"
        class="my-1 mr-2"
        @click="() => undefined"
      >
        <template #prepend>
          <v-icon icon="mdi-account-heart-outline" start color="primary" />
        </template>
        {{
          $t(
            'common.user.count.follower',
            {
              count: user._count.followees,
            },
            user._count.followees,
          )
        }}
      </v-chip>
    </v-card-text>
    <slot>
      <div class="pb-3"></div>
    </slot>
  </v-card>

  <v-display-image v-model="selectedImageSrc" />
</template>

<script lang="ts" setup>
import { inject, ref } from 'vue';

import VDisplayImage from '@/components/VDisplayImage.vue';
import { useUser } from '@/composables';
import { KEYS } from '@/constants';
import { Format } from '@/helpers';

const LAZY_BACKGROUND = import.meta.env.VITE_NO_BACKGROUND_URL;

const props = defineProps<{ coverUrl?: string; photoUrl?: string }>();

const user = inject(KEYS.USERS.PAGE.PROFILE_USER)!;
const { coverUrl, photoUrl } = useUser(user);

const selectedImageSrc = ref<string>();
</script>

<style lang="scss" scoped>
.profile-page {
  .avatar {
    margin-top: -3.75rem;
  }

  .profile {
    display: flex;
    flex-wrap: wrap;
    & > *:not(:last-child) {
      margin-right: 0.75rem;
    }

    & > * {
      display: flex;
      align-items: center;
    }
  }
}
</style>

<style lang="scss">
.profile-page {
  .actions {
    & > *:not(:first-child) {
      margin-left: 0.5rem;
    }
  }
}
</style>
