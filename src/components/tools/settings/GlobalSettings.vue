<template>
  <div class="global-settings">
    <document-settings />
    <app-settings />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import AppSettings from "@/components/tools/settings/AppSettings.vue";
import DocumentSettings from "@/components/tools/settings/DocumentSettings.vue";

@Component({ components: { AppSettings, DocumentSettings }})
export default class GlobalSettings extends Vue {
}
</script>

<style lang="scss" scoped>
.global-settings {
  > div:not(:last-child) {
    margin-bottom: 50px;
  }
}
</style>
