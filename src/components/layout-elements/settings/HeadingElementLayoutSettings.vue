<template>
  <div class="heading-settings">
    <text-input v-model="element.text" :disabled="element.locked" />
    <dropdown
      :items="styles"
      v-model="element.type"
      :disabled="element.locked"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import HeadingElement from '@/models/layout-elements/HeadingElement';
import Dropdown, { DropdownItem } from "@/components/ui/Dropdown.vue";

@Component({ components: { Dropdown }})
export default class HeadingElementLayoutSettings extends Vue {
  @Prop(Object)
  readonly element!: HeadingElement;

  private get styles(): DropdownItem[] {
    const styles: DropdownItem[] = [
      { name: "First Level", value: "h1" },
      { name: "Second Level", value: "h2" },
      { name: "Third Level", value: "h3" },
      { name: "Fourth Level", value: "h4" },
      { name: "Fifth Level", value: "h5" }
      ];
    return styles;
  }
}
</script>

<style lang="scss" scoped>
.heading-settings {
  display: flex;

  .dropdown {
    flex: 0 0 auto;
    margin-left: 10px;
  }
}
</style>
