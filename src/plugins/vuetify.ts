/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css';
import '@/scss/styles.scss';

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
          primary: '#2E6C0D',
          'on-primary': '#FFFFFF',
          'primary-container': '#AFF588',
          'on-primary-container': '#072100',
          secondary: '#006783',
          'on-secondary': '#FFFFFF',
          'secondary-container': '#BCE9FF',
          'on-secondary-container': '#001F29',
          tertiary: '#5E52A7',
          'on-tertiary': '#FFFFFF',
          'tertiary-container': '#E5DEFF',
          'on-tertiary-container': '#190261',
          background: '#FDFDF5',
          'on-background': '#1A1C18',
          surface: '#FDFDF5',
          'on-surface': '#1A1C18',
          'surface-variant': '#E0E4D6',
          'on-surface-variant': '#43483E',
          outline: '#74796D',
          'on-inverse-surface': '#F1F1EA',
          'inverse-surface': '#2F312D',
          'inverse-primary': '#94D86F',
          shadow: '#000000',
          'surface-tint': '#2E6C0D',
          'outline-variant': '#C3C8BB',
          scrim: '#000000',
          error: '#BC004C',
          'on-error': '#FFFFFF',
          'error-container': '#FFD9DE',
          'on-error-container': '#400015',
          success: '#346A22',
          'on-success': '#FFFFFF',
          'success-container': '#B4F39A',
          'on-success-container': '#042100',
          warning: '#755B00',
          'on-warning': '#FFFFFF',
          'warning-container': '#FFDF91',
          'on-warning-container': '#241A00',
          info: '#984061',
          'on-info': '#FFFFFF',
          'info-container': '#FFD9E2',
          'on-info-container': '#3E001D',
        },
      },
      dark: {
        colors: {
          primary: '#94D86F',
          'on-primary': '#123800',
          'primary-container': '#1D5200',
          'on-primary-container': '#AFF588',
          secondary: '#61D4FF',
          'on-secondary': '#003545',
          'secondary-container': '#004D63',
          'on-secondary-container': '#BCE9FF',
          tertiary: '#C8BFFF',
          'on-tertiary': '#2F2176',
          'tertiary-container': '#463A8D',
          'on-tertiary-container': '#E5DEFF',
          background: '#1A1C18',
          'on-background': '#E3E3DC',
          surface: '#1A1C18',
          'on-surface': '#E3E3DC',
          'surface-variant': '#43483E',
          'on-surface-variant': '#C3C8BB',
          outline: '#8D9286',
          'on-inverse-surface': '#1A1C18',
          'inverse-surface': '#E3E3DC',
          'inverse-primary': '#2E6C0D',
          shadow: '#000000',
          'surface-tint': '#94D86F',
          'outline-variant': '#43483E',
          scrim: '#000000',
          error: '#FFB2BE',
          'on-error': '#660026',
          'error-container': '#900039',
          'on-error-container': '#FFD9DE',
          success: '#99D680',
          'on-success': '#0A3900',
          'success-container': '#1C520A',
          'on-success-container': '#B4F39A',
          warning: '#F3C017',
          'on-warning': '#3E2E00',
          'warning-container': '#594400',
          'on-warning-container': '#FFDF91',
          info: '#FFB0C8',
          'on-info': '#5E1133',
          'info-container': '#7B2949',
          'on-info-container': '#FFD9E2',
        },
      },
    },
  },
});
