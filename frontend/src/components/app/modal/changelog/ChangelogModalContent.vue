<script lang="ts">
import { Vue, Options } from "vue-property-decorator";
// @ts-ignore
import { html } from "@/../changelog.md";
import VuexHelper from "@/helper/VuexHelper";
import { GLOBAL_STORE_NAMESPACE } from "@/store/global/globalStoreModule";
import { GlobalStoreMutations } from "@/store/global/globalStoreMutations";

const globalStore = VuexHelper.createNamespace(GLOBAL_STORE_NAMESPACE);

@Options({
  emits: ["close"],
})
export default class ChangelogModalContent extends Vue {

  private get changelog(): string {
    return (html as string)
      .replaceAll("<h3>", "<h3><span>")
      .replaceAll("</h3>", "</span></h3>")
      .replaceAll("__", "</span><span>");
  }

  private get appVersion(): string {
    return import.meta.env.PACKAGE_VERSION ;
  }

  private onClose() {
    globalStore.commit(GlobalStoreMutations.SET_CHANGELOG_LAST_SEEN, this.appVersion);
    this.$emit("close");
  }
}
</script>

<template src="@/components/app/modal/changelog/changelog.template.html" />
<style src="@/components/app/modal/changelog/changelog.style.scss" lang="scss" scoped />
