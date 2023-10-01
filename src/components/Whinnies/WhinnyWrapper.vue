<template>
  <div :class="[$vuetify.display.xs ? 'pa-2' : 'pa-4']">
    <div v-if="$slots.reference">
      <slot name="reference" />
    </div>
    <div class="d-flex">
      <div
        v-if="direction === 'horizontal'"
        class="flex-grow-0 flex-shrink-0"
        :class="[
          {
            [$vuetify.display.xs ? 'mr-2' : 'mr-4']: direction === 'horizontal',
          },
        ]"
      >
        <v-hover #default="{ isHovering, props }">
          <v-avatar @click.stop="$emit('gotoUser')" v-bind="props">
            <v-avatar :image="photoUrl" color="secondary-container" />
            <v-overlay :model-value="isHovering" contained />
          </v-avatar>
        </v-hover>
      </div>
      <div class="flex-grow-1 flex-shrink-1">
        <div class="d-flex" :class="{ 'mb-3': $slots.userInfo }">
          <v-hover #default="{ isHovering, props }">
            <v-avatar
              v-if="direction === 'vertical'"
              :class="[$vuetify.display.xs ? 'mr-2' : 'mr-4']"
              @click.stop="$emit('gotoUser')"
              v-bind="props"
            >
              <v-avatar :image="photoUrl" color="secondary-container" />
              <v-overlay :model-value="isHovering" contained />
            </v-avatar>
          </v-hover>

          <slot name="userInfo" />
        </div>
        <div>
          <slot />
        </div>
        <div v-if="$slots.medias">
          <slot name="medias" />
        </div>
        <div v-if="$slots.detail" class="mt-3">
          <slot name="detail" />
        </div>
        <div v-if="$slots.action" class="mt-3">
          <div class="d-flex justify-space-between align-center">
            <slot name="action" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps<{ direction: 'horizontal' | 'vertical'; photoUrl?: string }>();

defineEmits<{ (event: 'gotoUser'): void }>();
</script>
