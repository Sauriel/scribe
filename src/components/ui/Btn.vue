<template>
  <button
    @click="$emit('click', $event)"
    :class="{
      'alert': alert,
      'block': fullWidth
    }"
    :disabled="disabled"
  >
    <slot>
      <font-awesome-icon v-if="icon" :icon="icon" />
      <strong v-if="text">
        {{ text }}
      </strong>
    </slot>
  </button>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Btn extends Vue {
  @Prop(String)
  readonly text!: string;

  @Prop(String)
  readonly icon!: string;

  @Prop({type: Boolean, default: false})
  readonly disabled!: boolean;

  @Prop({type: Boolean, default: false})
  readonly alert!: boolean;

  @Prop({type: Boolean, default: false})
  readonly fullWidth!: boolean;
}
</script>

<style lang="scss" scoped>
  @import "@/style/colors.scss";

  button {
    flex: 1 1 auto;
    margin: 10px;
    min-height: 30px;
    min-width: 30px;
    background-color: $primary;
    border: 1px solid $primaryDark;
    color: $foreground;
    border-radius: 0;
    padding: 4px 10px;
    cursor: pointer;

    &:disabled {
      cursor: not-allowed;
      background-color: $backgroundLight;
      border-color: $backgroundDark;

    &:hover {
      background-color: $backgroundLight;
      border-color: $backgroundDark;
    }
    }

    &.alert {
      background-color: $alert;
      color: $foreground;
    }
    
    &.block {
      width: 100%;
      margin: 10px 0;
    }

    &:focus,
    &:active {
      outline: none;
    }

    &:hover {
      background-color: $primaryLight;
      border-color: $primary;
    }

    > svg:not(:last-child) {
      margin-right: 5px;
    }
  }
</style>
