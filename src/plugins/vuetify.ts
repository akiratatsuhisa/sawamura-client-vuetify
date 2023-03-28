/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css';
import '@/main.scss';

// Composables
import { createVuetify } from 'vuetify';
import { md3 } from 'vuetify/blueprints';

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  blueprint: md3,
  theme: {
    themes: {
      light: {
        colors: {
          primary: '#315da8',
          secondary: '#9b4050',
          tertiary: '#2d6b26',
        },
      },
      dark: {
        colors: {
          primary: '#adc6ff',
          secondary: '#ffb2bb',
          tertiary: '#93d784',
        },
      },
    },
  },
});
