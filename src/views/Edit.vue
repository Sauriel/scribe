<template>
  <div class="container">
    <tools v-if="!hideTools" />
    <div class="panel-concealer panel-concealer--left" @click="hideTools = !hideTools">
      <font-awesome-icon :icon="hideTools ? 'chevron-right' : 'chevron-left'" />
    </div>
    <pages :class="{ 'hidden-tools': hideTools }" />
    <div v-if="showOverviewOnRightSide" class="panel-concealer panel-concealer--right" :class="{ 'panel-concealer--right-fix': hideOverview }" @click="hideOverview = !hideOverview">
      <font-awesome-icon :icon="hideOverview ? 'chevron-left' : 'chevron-right'" />
    </div>
    <pages-overview v-if="showOverviewOnRightSide && !hideOverview" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Tools from "@/components/Tools.vue";
import Pages from "@/components/Pages.vue";
import PagesOverview from "@/components/PagesOverview.vue";
import VuexHelper from "@/helper/VuexHelper";

const appStore = VuexHelper.createNamespace("appStore");

@Component({
  components: { Tools, Pages, PagesOverview }
})
export default class Edit extends Vue {
  private hideTools = false;
  private hideOverview = false;

  private get showOverviewOnRightSide(): boolean {
    return appStore.getters("showOverview");
  }
}
</script>

<style lang="scss" scoped>
  @import "@/style/colors.scss";

  .container {
    display: flex;

    .panel-concealer {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 40px;
      font-size: 36px;
      cursor: pointer;
      position: relative;

      @media print {
        display: none;
      }

      &::before {
        content: "";
        border: 40px solid transparent;
        height: 200px;
        position: absolute;
        z-index: -1
      }

      &--left::before {
        border-left-color: $backgroundLight;
        left: 0px;
      }

      &--right {
        position: absolute;
        top: 0;
        height: 100vh;
        right: 210px;

        &::before {
          border-right-color: $backgroundLight;
          right: 0px;
        }

        &-fix {
          right: 10px;
        }
      }
    }
  }
</style>
