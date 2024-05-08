<template>
  <div class="accordion" :class="{ 'accordion--open': visible}">
    <div class="accordion-header" @click="visible = !visible">
      <slot name="header" />
      <icon icon="chevron-down"/>
    </div>
    <div class="accordion-content" v-if="visible">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Accordion extends Vue {
  @Prop({ type: Boolean, default: true })
  readonly open!: boolean;

  private visible = true;

  created() {
    this.visible = this.open;
  }
}
</script>

<style lang="scss" scoped>
@import "@/style/colors.scss";

.accordion {
  &--open {
    .accordion-header > svg {
      transform: rotate(180deg);
    }
  }

  &-header {
    user-select: none;
    cursor: pointer;
    position: relative;

    > svg {
      position: absolute;
      right: 0;
      top: 10px;
      transform-origin: center;
      transition: transform .2s ease-in-out;
    }
  }

  &-content {

  }
}
</style>
