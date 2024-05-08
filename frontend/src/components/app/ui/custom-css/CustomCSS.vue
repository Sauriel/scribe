<template>
  <component :is="'style'" v-if="parsedCss">
    {{ parsedCss }}
  </component>
</template>

<script lang="ts">
import CSSHelper from "@/helper/CSSHelper";
import { Vue, Prop } from "vue-property-decorator";

export default class CustomCSS extends Vue {
  @Prop({ type: String, required: false })
  private readonly style?: string;

  @Prop({ type: String, required: false })
  private readonly prefix?: string;

  private get parsedCss(): string | undefined {
    if (!this.style) {
      return undefined;
    }
    if (!this.prefix) {
      return this.style;
    }
    return CSSHelper.prefixStyles(`.${this.prefix}`, this.style);
  }
}
</script>