<template>
  <div class="confirm-dialog">
    <heading class="confirm-dialog-message">
      {{ $t(message) }}
    </heading>
    <footer class="footer">
      <btn outline @click="onClick(false)">{{ $t(abortButton) }}</btn>
      <btn @click="onClick(true)">{{ $t(confirmButton) }}</btn>
    </footer>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Options } from "vue-property-decorator";

export interface ConfirmDialogPayload {
  message: string;
  confirmButton?: string;
  abortButton?: string;
  callback: (replace: boolean) => void;
}

@Options({
  emits: ["close"],
})
export default class ConfirmDialogContent extends Vue {
  @Prop({ type: Object, required: true })
  private readonly payload!: ConfirmDialogPayload;

  private get message(): string {
    return this.payload.message;
  }

  private get confirmButton(): string {
    return this.payload.confirmButton || "confirm-dialog.ok";
  }

  private get abortButton(): string {
    return this.payload.abortButton || "confirm-dialog.abort";
  }

  private onClick(confirm: boolean) {
    this.payload.callback(confirm);
    this.$emit("close");
  }
}
</script>

<style lang="scss" scoped>
.footer {
  display: flex;
  justify-content: space-between;
  margin: -10px;
}

.confirm-dialog-message {
  max-width: 550px;
}
</style>
