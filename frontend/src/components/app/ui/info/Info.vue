<template>
  <div class="info" :class="{
    'info--small': small,
    'info--success': type === 'success',
    'info--warning': type === 'warning'
  }">
    <div class="info-icon" :class="{ 'info-icon--colored': coloredIcon}">
      <font-awesome-icon :icon="icon" />
    </div>
    <div class="info-text" v-html="text" />
  </div>
</template>

<script lang="ts">
import { Vue, Prop } from "vue-property-decorator";

export declare type InfoType = "info" | "success" | "warning";

export default class Info extends Vue {
  @Prop({ type: String, required: true })
  private readonly text!: string;

  @Prop({ type: String, default: "info" })
  private readonly type!: InfoType;

  @Prop({ type: Boolean, default: false })
  private readonly small!: boolean;

  @Prop({ type: Boolean, default: false })
  private readonly coloredIcon!: boolean;

  private get icon(): string {
    if (this.type === "success") {
      return "check-circle";
    } else if (this.type === "warning") {
      return "exclamation-triangle";
    } else {
      return "info-circle";
    }
  }
}
</script>

<style lang="scss" scoped>
.info {
  --info-color: var(--color-primary);
  display: flex;
  background-color: var(--color-background--light);
  border-left: 0.25rem solid var(--info-color);
  border-radius: var(--border-radius);

  &-icon {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1rem;
    font-size: 3rem;

    &--colored {
      color: var(--info-color);
    }
  }

  &-text {
    margin: -1em 0;
    padding: 1rem;
    font-size: 0.8em;

    &:deep(a) {
      color: var(--color-secondary);

      &:hover {
        color: var(--color-primary--light);
      }
    }
  }

  &--success {
    --info-color: var(--color-success);
  }

  &--warning {
    --info-color: var(--color-warning);
  }

  &--small {
    .info-icon {
      font-size: 1.5rem;
      padding: 0.5rem;
    }

    .info-text {
      margin: -0.5em 0;
      padding: 0.75rem 0.5rem;
    }
  }
}
</style>
