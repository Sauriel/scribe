<template src="@/components/app/ui/modal/modal.template.html" />

<script lang="ts">
import { Vue } from "vue-property-decorator";
import { ModalUpdateEvent, MODAL_UPDATE_EVENT_NAME } from "@/events/modal";
import emitter from "@/emitter";
import { BLURRED_CLASS, CONTENT_ID, TOP_BAR_ID } from "@/App.vue";

export default class Modal extends Vue {
  private show = false;
  private component?: string;
  private payload?: unknown;
  private fullscreen = false;
  private noMinWidth = false;

  private get visible(): boolean {
    return this.show;
  }

  private set visible(value: boolean) {
    const topBar = document.getElementById(TOP_BAR_ID);
    const content = document.getElementById(CONTENT_ID);
    if (content && topBar) {
      if (value) {
        topBar.classList.add(BLURRED_CLASS);
        content.classList.add(BLURRED_CLASS);
      } else {
        topBar.classList.remove(BLURRED_CLASS);
        content.classList.remove(BLURRED_CLASS);
      }
    }
    this.show = value;
  }

  private onClose() {
    this.visible = false;
  }

  created() {
    emitter.$on(MODAL_UPDATE_EVENT_NAME, (event: ModalUpdateEvent<unknown>) => {
      this.component = event.payload.component;
      this.visible = event.payload.visible;
      this.payload = event.payload.payload;
      this.fullscreen = !!event.payload.fullscreen;
      this.noMinWidth = !!event.payload.noMinWidth;
    });
  }
}
</script>

<style src="@/components/app/ui/modal/modal.style.scss" lang="scss" scoped />
