import VBaseDialog from '@/components/BaseDialog.vue';
import VBaseLoading from '@/components/BaseLoading.vue';
import VBaseBottomSheet from '@/components/VBaseBottomSheet.vue';
import VBaseMenu from '@/components/VBaseMenu.vue';
import VFloatingActionButton from '@/components/VFloatingActionButton.vue';
import VFloatingActionButtonWrapper from '@/components/VFloatingActionButtonWrapper.vue';

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    VBaseDialog: typeof VBaseDialog;
    VBaseLoading: typeof VBaseLoading;
    VBaseBottomSheet: typeof VBaseBottomSheet;
    VBaseMenu: typeof VBaseMenu;
    VFloatingActionButton: typeof VFloatingActionButton;
    VFloatingActionButtonWrapper: typeof VFloatingActionButtonWrapper;
  }
}
