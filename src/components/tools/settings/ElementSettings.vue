<template>
  <div>
    <h1>
      <span>
        Customize {{ elementName }}
      </span>
      <font-awesome-icon :icon="!element.locked ? 'unlock' : 'lock'" @click="toogleElementLock" />
    </h1>
    <component v-if="element" :is="settingsComponent" :element="element" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import VuexHelper from "@/helper/VuexHelper";
import LayoutElement from '@/models/layout-elements/LayoutElement';

const layoutStore = VuexHelper.createNamespace("layoutStore");

@Component
export default class ElementSettings extends Vue {

  private get element(): LayoutElement | undefined {
    return layoutStore.getters("editingElement");
  }

  private get elementName(): string {
    const element = this.element;
    if (element && element.name) {
      return element.name;
    }
    return "Element";
  }

  private get settingsComponent(): string {
    return this.element ? this.element.component + "Settings" : "";
  }

  private toogleElementLock() {
    if (this.element) {
      this.element.locked = !this.element.locked;
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/style/colors.scss";

h1 {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .svg-inline--fa {
    font-size: .5em;
    cursor: pointer;

    &.fa-lock {
      color: $alert;
    }
  }
}
</style>
