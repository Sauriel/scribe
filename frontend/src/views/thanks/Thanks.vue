<script lang="ts">
import { Vue } from "vue-class-component";
import { LINK_TO_PATREON_BROADCAST_CHANNEL_NAME, PatreonBroadcastMessage } from "../profile/Profile.vue";

declare type ThanksSource = "patreon" | "";

export default class Thanks extends Vue {
  
  mounted() {
    const source  = this.$route.query.source as ThanksSource;
    if (source === "patreon") {
      const patreonBroadcaster = new BroadcastChannel(LINK_TO_PATREON_BROADCAST_CHANNEL_NAME);
      patreonBroadcaster.postMessage(PatreonBroadcastMessage.LINK_SUCCESS);
      patreonBroadcaster.onmessage = (event: MessageEvent<PatreonBroadcastMessage>) => {
        if (event.data === PatreonBroadcastMessage.CLOSE_TAB) {
          window.close();
        }
      };
    }
  }
}
</script>

<template src="@/views/thanks/thanks.template.html" />
<style src="@/views/thanks/thanks.style.scss" lang="scss" scoped />