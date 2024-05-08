<template>
  <font-awesome-icon
    :icon="icon"
    @click.stop="onClick"
    :class="{
      'disabled': disabled
    }"
  />
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Icon extends Vue {
  @Prop(String)
  readonly icon!: string;

  @Prop({ type: Boolean, default: false})
  readonly disabled!: boolean;

  private onClick(event: MouseEvent) {
    if (!this.disabled) {
      this.$emit("click", event);
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "@/style/colors.scss";

  .disabled {
    color: $backgroundLight !important;
    cursor: not-allowed !important;
  }
</style>
