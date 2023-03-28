<template>
  <v-row>
    <v-col cols="12" sm="12" md="7" lg="8">
      <v-card>
        <v-card-title>Infomation</v-card-title>
      </v-card>
    </v-col>
    <v-col cols="12" sm="12" md="5" lg="4">
      <v-card>
        <v-toolbar density="compact" color="surface" elevation="1" class="mb-3">
          <v-app-bar-nav-icon
            icon="mdi-chart-line"
            @click="randomSeries"
          ></v-app-bar-nav-icon>
          <v-toolbar-title> Chart </v-toolbar-title>
        </v-toolbar>
        <apexchart :options="options" :series="series"></apexchart>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
import { ApexOptions } from 'apexcharts';
import { computed, ref } from 'vue';
import { useTheme } from 'vuetify';

const theme = useTheme();

const options = computed<ApexOptions>(() => ({
  chart: {
    type: 'bar',
    background: theme.current.value.colors.surface,
  },
  theme: {
    mode: theme.current.value.dark ? 'dark' : 'light',
  },
  plotOptions: {
    bar: {
      horizontal: true,
      dataLabels: {
        position: 'center',
      },
    },
  },
  colors: [
    theme.current.value.colors.primary,
    theme.current.value.colors.secondary,
  ],
  dataLabels: {
    style: {
      colors: ['#fff'],
    },
  },
  xaxis: {
    categories: [2001, 2002, 2003, 2004, 2005, 2006, 2007],
  },
}));

const series = ref<Array<{ name: string; data: Array<number> }>>([
  {
    name: 'messages',
    data: [44, 55, 41, 64, 22, 43, 21],
  },
  {
    name: 'files',
    data: [53, 32, 33, 52, 13, 44, 32],
  },
]);

function randomSeries() {
  series.value = series.value.map(({ name, data }) => ({
    name: name,
    data: data.map(() => Math.ceil(Math.random() * 100)),
  }));
}
</script>
