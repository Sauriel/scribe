<template>
  <div v-if="visible" class="notification" :class="'notification-' + type">
    {{ notification }}
  </div>
</template>

<script lang="ts">
import { Vue } from "vue-property-decorator";
import {
  NotificationUpdateEvent,
  NotificationType,
  NOTIFICATION_UPDATE_EVENT_NAME,
} from "@/events/notification";
import emitter from "@/emitter";

export default class Notification extends Vue {
  private show = false;
  private notification = "";
  private type: NotificationType = "success";

  private get visible(): boolean {
    return this.show;
  }

  created() {
    emitter.$on(NOTIFICATION_UPDATE_EVENT_NAME, (event: NotificationUpdateEvent) => {
      this.show = false;
      this.show = event.payload.visible;
      this.notification = event.payload.content;
      this.type = event.payload.type;
      this.startTimeout(event.payload.timeout || 3000);
    });
  }

  private startTimeout(timeout: number) {
    setTimeout(() => {
      this.show = false;
    }, timeout);
  }
}
</script>

<style lang="scss" scoped>
.notification {
  position: fixed;
  top: -70px;
  left: 50%;
  transform: translateX(-50%);
  padding: 1rem 2rem;
  border-radius: var(--border-radius);
  animation-name: scrollIn;
  animation-duration: 1s;
  animation-fill-mode: forwards;
  z-index: 999999;

  &-success {
    background-color: var(--color-success);
  }

  &-failure {
    background-color: var(--color-alert);
  }
}

@keyframes scrollIn {
  from {
    top: -70px;
    opacity: 0;
  }

  to {
    top: 70px;
    opacity: 1;
  }
}
</style>
