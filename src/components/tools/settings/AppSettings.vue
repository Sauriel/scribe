<template>
  <div>
    <accordion :open="false">
      <template v-slot:header>
        <h1>Global</h1>
      </template>
      <ul>
        <li>
          <switch-input v-model="showOverviewOnRightSide">
            Show pages overview on right side.
          </switch-input>
        </li>
        <li>
          <switch-input v-model="alwaysShowElementBorder">
            Always show border around elements.
          </switch-input>
        </li>
        <li>
          <switch-input v-model="quickAccessRowOnlyOnPageEnd">
            Show Quick Access Row only on end of page.
          </switch-input>
        </li>
      </ul>
    </accordion>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import VuexHelper from "@/helper/VuexHelper";
import SwitchInput from "@/components/ui/SwitchInput.vue";
import Accordion from "@/components/ui/Accordion.vue";

const appStore = VuexHelper.createNamespace("appStore");

@Component({ components: { SwitchInput, Accordion }})
export default class AppSettings extends Vue {

  private get showOverviewOnRightSide(): boolean {
    return appStore.getters("showOverview");
  }

  private set showOverviewOnRightSide(value: boolean) {
    appStore.commit("setShowOverview", value);
  }

  private get alwaysShowElementBorder(): boolean {
    return appStore.getters("alwaysShowElementBorder");
  }

  private set alwaysShowElementBorder(value: boolean) {
    appStore.commit("setAlwaysShowElementBorder", value);
  }

  private get quickAccessRowOnlyOnPageEnd(): boolean {
    return appStore.getters("quickAccessRowOnlyOnPageEnd");
  }

  private set quickAccessRowOnlyOnPageEnd(value: boolean) {
    appStore.commit("setQuickAccessRowOnlyOnPageEnd", value);
  }
}
</script>

<style lang="scss" scoped>
ul {
  list-style: none;
  padding: 0;
  margin: 0;

  li {
    margin: 10px 0;
  }
}
</style>
