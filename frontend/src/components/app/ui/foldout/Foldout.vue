<template>
  <div class="foldout" :class="{ 'foldout--open': visible }">
    <div class="foldout-header" @click="changeVisibility">
      <slot name="header" />
      <font-awesome-icon icon="chevron-down" />
    </div>
    <div class="foldout-content" v-if="visible">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Options } from "vue-property-decorator";

@Options({
  watch: {
    open(value) {
      this.visible = value;
    },
  },
})
export default class Foldout extends Vue {
  @Prop({ type: Boolean, default: false })
  private readonly open!: boolean;

  private visible = true;

  created() {
    this.visible = this.open;
  }

  private changeVisibility() {
    this.visible = !this.visible;
    this.$emit("visibility:changed", this.visible);
    if (this.visible) {
      this.$emit("visibility:visible");
    } else {
      this.$emit("visibility:hidden");
    }
  }
}
</script>

<style lang="scss" scoped>
.foldout {
  &--open {
    .foldout-header > svg {
      transform: rotate(180deg);
    }
  }

  &-header {
    user-select: none;
    cursor: pointer;
    position: relative;
    background-color: var(--color-background--dark);
    padding: 5px;
    padding-right: 24px;
    border-bottom: 2px solid var(--color-primary);

    &:hover {
      background-color: var(--color-background--light);
      border-bottom-color: var(--color-primary--light);
    }

    > svg {
      position: absolute;
      right: 10px;
      top: 50%;
      margin-top: -8px;
      transform-origin: center;
      transition: transform 0.2s ease-in-out;
    }
  }
}
</style>
