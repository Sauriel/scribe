<template>
  <div class="global-settings">
    <heading>{{ $t("app.settings.header") }}</heading>
    <div class="global-settings-content">
      <ul>
        <li>
          <input-switch v-model="showElementBorders">
            <span class="settings-label">
              {{ $t("app.settings.elements.border.always") }}
            </span>
          </input-switch>
        </li>
        <li>
          <input-switch v-model="showMoveHandleOnHover">
            <span class="settings-label">
              {{ $t("app.settings.elements.handle.hover") }}
            </span>
          </input-switch>
        </li>
        <li>
          <input-switch v-model="autosave">
            <span class="settings-label">
              {{ $t("app.settings.save.auto") }}
            </span>
          </input-switch>
        </li>
        <li>
          <input-switch v-model="inlineTipTapBubble">
            <span class="settings-label">
              {{ $t("app.settings.tiptap.inline.bubble.show") }}
            </span>
          </input-switch>
        </li>
        <li>
          <input-switch v-model="allowAnalytics">
            <span class="settings-label">
              {{ $t("app.settings.analytics.enable") }}
            </span>
          </input-switch>
        </li>
      </ul>
      <heading>
        {{ $t("app.settings.theme.header") }}
      </heading>
      <dropdown v-model="theme" :items="themes" />
    </div>
    <footer v-if="!noModal">
      <btn outline @click="$emit('close')">{{ $t("app.settings.footer.close") }}</btn>
    </footer>
  </div>
</template>

<script lang="ts">
import { Vue, Options, Prop } from "vue-property-decorator";
import VuexHelper from "@/helper/VuexHelper";
import { GLOBAL_STORE_NAMESPACE } from "@/store/global/globalStoreModule";
import { GlobalStoreGetters } from "@/store/global/globalStoreGetters";
import { GlobalStoreMutations } from "@/store/global/globalStoreMutations";
import { DropdownItem } from "@/components/app/ui/dropdown/Dropdown.vue";
import { DEFAULT, THEMES } from "@/models/ThemeVariables";

const globalStore = VuexHelper.createNamespace(GLOBAL_STORE_NAMESPACE);

@Options({
  emits: ["close"],
})
export default class GlobalSettingsModalContent extends Vue {
  @Prop({ type: Boolean, default: false })
  private readonly noModal!: boolean;


  private get showElementBorders(): boolean {
    return !!globalStore.getters(GlobalStoreGetters.ELEMENT_BORDERS);
  }

  private set showElementBorders(value: boolean) {
    globalStore.commit(GlobalStoreMutations.SET_ELEMENT_BORDERS, value);
  }

  private get showMoveHandleOnHover(): boolean {
    return !!globalStore.getters(GlobalStoreGetters.MOVE_HANDLER_ON_HOVER);
  }

  private set showMoveHandleOnHover(value: boolean) {
    globalStore.commit(GlobalStoreMutations.SET_MOVE_HANDLER_ON_HOVER, value);
  }

  private get autosave(): boolean {
    return !!globalStore.getters(GlobalStoreGetters.AUTOSAVE);
  }

  private set autosave(value: boolean) {
    globalStore.commit(GlobalStoreMutations.SET_AUTOSAVE, value);
  }

  private get inlineTipTapBubble(): boolean {
    return !!globalStore.getters(GlobalStoreGetters.INLINE_TIPTAP_BUBBLE);
  }

  private set inlineTipTapBubble(value: boolean) {
    globalStore.commit(GlobalStoreMutations.SET_INLINE_TIPTAP_BUBBLE, value);
  }

  private get allowAnalytics(): boolean {
    return !!globalStore.getters(GlobalStoreGetters.ALLOW_ANALYTICS);
  }

  private set allowAnalytics(value: boolean) {
    globalStore.commit(GlobalStoreMutations.SET_ALLOW_ANALYTICS, value);
  }

  private get theme(): string {
    return globalStore.getters(GlobalStoreGetters.THEME) || DEFAULT.name;
  }

  private set theme(value: string) {
    globalStore.commit(GlobalStoreMutations.SET_THEME, value);
  }

  private get themes(): DropdownItem[] {
    return THEMES.map((theme) => ({
      name: this.$t("app.settings.theme." + theme.name),
      value: theme.name,
    }));
  }
}
</script>

<style lang="scss" scoped>
.global-settings {
  flex: 1 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  &-content {
    display: flex;
    flex-direction: column;
    max-width: 560px;

    ul {
      list-style: none;
      padding: 0;
      margin: 0;

      li {
        margin: 10px 0;
      }
    }

    .settings-label {
      margin-left: 0.5rem;
    }
  }

  footer {
    display: flex;
    justify-content: space-between;
    margin: 0 -10px -10px;

    & > button {
      flex-grow: 0;
    }
  }
}
</style>
