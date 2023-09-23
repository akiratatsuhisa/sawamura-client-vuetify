import VBaseDialog from '@/components/BaseDialog.vue';
import VBaseMenu from '@/components/VBaseMenu.vue';
import VFloatingActionButton from '@/components/VFloatingActionButton.vue';

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    BaseDialog: typeof VBaseDialog;
    BaseMenu: typeof VBaseMenu;
    VFloatingActionButton: typeof VFloatingActionButton;
  }
}
