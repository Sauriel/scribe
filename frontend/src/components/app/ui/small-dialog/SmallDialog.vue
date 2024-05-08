<template>
  <div class="background" v-if="visible">
    <div class="dialog">
      <component v-if="component" :is="component" :payload="payload" @close="onClose" />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue } from "vue-property-decorator";
import { DialogUpdateEvent, DIALOG_UPDATE_EVENT_NAME } from "@/events/dialog/";
import emitter from "@/emitter";

export default class SmallDialog extends Vue {
  private show = false;
  private component?: string;
  private payload?: unknown;

  private get visible(): boolean {
    return this.show;
  }

  private set visible(value: boolean) {
    this.show = value;
  }

  private onClose() {
    this.visible = false;
  }

  created() {
    emitter.$on(DIALOG_UPDATE_EVENT_NAME, (event: DialogUpdateEvent<unknown>) => {
      this.component = event.payload.component;
      this.visible = event.payload.visible;
      this.payload = event.payload.payload;
    });
  }
}
</script>

<style lang="scss" scoped>
.background {
  background-color: rgba(0, 0, 0, 0.75);
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
}

.dialog {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: var(--color-background);
  min-width: 250px;
  max-width: calc(100vw - 100px);
  max-height: calc(100vh - 100px);
  padding: 1rem;
  border-radius: var(--border-radius);
  border: 1px solid var(--color-foreground--dark);
}
</style>
