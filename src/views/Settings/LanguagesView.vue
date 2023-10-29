<template>
  <h3 class="text-h5">{{ translateInterfaceLanguage('title') }}</h3>

  <span class="text-subtitle-2 font-weight-light text-high-emphasis">
    {{
      translateInterfaceLanguage('subtitle', {
        language: $t(`common.languages.${selectedLanguage}`),
      })
    }}
  </span>

  <v-radio-group v-model="selectedLanguage" hide-details>
    <div
      class="v-picker ma-0 mt-3 mx-md-6"
      :style="{
        'grid-template-columns': `repeat(${
          $vuetify.display.smAndDown ? '1' : '3'
        }, 1fr)`,
      }"
    >
      <div
        v-for="(detail, language) in languages"
        :key="language"
        class="d-flex justify-space-between align-center pa-2 rounded-pill elevation-1 cursor-pointer"
        :class="[
          isActiveLanguage(language) ? 'bg-tertiary' : 'bg-tertiary-container',
        ]"
        @click.stop.prevent="() => (selectedLanguage = language)"
      >
        <v-radio
          :label="$t(`common.languages.${detail.name}`)"
          :value="language"
        >
          <template #label>
            <i18n-t
              :keypath="`common.languages.${detail.name}`"
              tag="span"
              scope="global"
              :locale="language"
            >
            </i18n-t>
            <span v-if="!isActiveLanguage(language)" class="ml-1">
              {{ $t(`common.languages.${detail.name}`) }}
            </span>
          </template>
        </v-radio>
        <v-avatar :image="detail.image" />
      </div>
    </div>
  </v-radio-group>
</template>

<script lang="ts" setup>
import { useLanguageStorage, usePageLocale } from '@/composables';

const { translate: translateInterfaceLanguage } = usePageLocale({
  prefix: 'settings.languages.interfaceLanguage',
});

const { languages, selectedLanguage, isActiveLanguage } = useLanguageStorage();
</script>

<style lang="scss" scoped>
.v-picker {
  display: grid;
  gap: 12px;
}
</style>
