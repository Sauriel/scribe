<template>
  <div v-if="!userHasDecided" class="analytics-info">
    <p v-html="$t('analytics-info.info')" />
    <footer class="footer">
      <btn outline @click="allow">
        {{ $t("analytics-info.allow") }}
      </btn>
      <btn outline @click="disallow">
        {{ $t("analytics-info.disallow") }}
      </btn>
    </footer>
  </div>
</template>

<script lang="ts">
import { Vue } from "vue-property-decorator";
import { bootstrap } from "vue-gtag";
import VuexHelper from "@/helper/VuexHelper";
import { GLOBAL_STORE_NAMESPACE } from "@/store/global/globalStoreModule";
import { GlobalStoreGetters } from "@/store/global/globalStoreGetters";
import { GlobalStoreMutations } from "@/store/global/globalStoreMutations";

const globalStore = VuexHelper.createNamespace(GLOBAL_STORE_NAMESPACE);

export default class AnalyticsInfo extends Vue {
  private get userHasDecided(): boolean {
    return !!globalStore.getters(GlobalStoreGetters.ANALYTICS_BANNER_SHOWN);
  }

  private get allowAnalytics(): boolean {
    return !!globalStore.getters(GlobalStoreGetters.ALLOW_ANALYTICS);
  }

  private set allowAnalytics(value: boolean) {
    globalStore.commit(GlobalStoreMutations.SET_ALLOW_ANALYTICS, value);
  }

  created() {
    this.loadGtagIfAllowed();
  }

  private loadGtagIfAllowed() {
    if (this.userHasDecided && this.allowAnalytics) {
      bootstrap().then((gtag) => {
        console.log("Thank you for allowing us to use cookies.");
      });
    }
  }

  private allow() {
    this.allowAnalytics = true;
    this.loadGtagIfAllowed();
    globalStore.commit(GlobalStoreMutations.SET_ANALYTICS_BANNER_SHOWN, true);
  }

  private disallow() {
    this.allowAnalytics = false;
    globalStore.commit(GlobalStoreMutations.SET_ANALYTICS_BANNER_SHOWN, true);
  }
}
</script>

<style lang="scss" scoped>
.analytics-info {
  display: flex;
  flex-direction: column;
  padding: 1em;
  position: fixed;
  top: 100px;
  left: 32vw;
  width: 36vw;
  background-color: var(--color-background);
  border: 4px solid var(--color-primary);
  border-radius: var(--border-radius);

  p {
    margin: 0;
  }

  .footer {
    margin-top: 1em;
    display: flex;
    gap: 2em;

    button {
      margin: 0;
    }
  }
}
</style>
