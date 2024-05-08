<template>
  <div class="add-link">
    <div class="add-link-content">
      <label class="add-link-content-label href-input">
        {{ $t("add-link.link.label") }}
        <input-field v-model="href" :placeholder="$t('add-link.link.placeholder')" />
      </label>
      <input-switch v-model="openInNewTab" class="add-link-content-label">
        {{ $t("add-link.link.target") }}
      </input-switch>
    </div>
    <footer class="footer">
      <btn outline @click="$emit('close')">{{ $t("add-link.close") }}</btn>
      <btn @click="applyChanges">{{ $t("add-link.apply") }}</btn>
    </footer>
  </div>
</template>

<script lang="ts">
import { LinkConfig } from "@/models";
import { Vue, Prop, Options } from "vue-property-decorator";

export interface AddLinkPayload {
  linkConfig: LinkConfig;
  callback: (config: LinkConfig) => void;
}

@Options({
  emits: ["close"],
})
export default class AddLinkDialogContent extends Vue {
  @Prop({ type: Object, required: true })
  private readonly payload!: AddLinkPayload;

  private get href(): string {
    return this.payload.linkConfig.href;
  }

  private set href(value: string) {
    this.payload.linkConfig.href = value;
  }

  private get openInNewTab(): boolean {
    return this.payload.linkConfig.openInNewTab;
  }

  private set openInNewTab(value: boolean) {
    this.payload.linkConfig.openInNewTab = value;
  }

  private applyChanges() {
    this.payload.callback(this.payload.linkConfig);
    this.$emit("close");
  }
}
</script>

<style lang="scss" scoped>
.add-link-content-label {
  margin-bottom: 1rem;

  &.href-input {
    display: flex;
    align-items: center;
  }
}

.footer {
  display: flex;
  justify-content: space-between;
  margin: -10px;
}
</style>
