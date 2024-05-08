<template>
  <div class="typogr">
    <div class="typogr-content">
      <div class="typogr-setting">
        <input-switch v-model="smartypants" class="typogr-content-label">
          {{ $t("typogr.smartypants.label") }}
        </input-switch>
        <tooltip position="bottom-left">
          <template #tooltip>
            {{ $t("typogr.smartypants.info") }}
          </template>
          <font-awesome-icon icon="info-circle" />
        </tooltip>
      </div>
      <div class="typogr-setting">
        <input-switch v-model="widont" class="typogr-content-label">
          {{ $t("typogr.widont.label") }}
        </input-switch>
        <tooltip position="bottom-left">
          <template #tooltip>
            {{ $t("typogr.widont.info") }}
          </template>
          <font-awesome-icon icon="info-circle" />
        </tooltip>
      </div>
    </div>
    <footer class="footer">
      <btn outline @click="$emit('close')">{{ $t("typogr.close") }}</btn>
      <btn @click="applyChanges">{{ $t("typogr.apply") }}</btn>
    </footer>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Options } from "vue-property-decorator";

export interface TypogrConfig {
  smartypants: boolean;
  widont: boolean;
}

export interface TypogrPayload {
  typogrConfig: TypogrConfig;
  callback: (config: TypogrConfig) => void;
}

@Options({
  emits: ["close"],
})
export default class TypogrDialogContent extends Vue {
  @Prop({ type: Object, required: true })
  private readonly payload!: TypogrPayload;

  private get smartypants(): boolean {
    return this.payload.typogrConfig.smartypants;
  }

  private set smartypants(value: boolean) {
    this.payload.typogrConfig.smartypants = value;
  }

  private get widont(): boolean {
    return this.payload.typogrConfig.widont;
  }

  private set widont(value: boolean) {
    this.payload.typogrConfig.widont = value;
  }

  private applyChanges() {
    this.payload.callback(this.payload.typogrConfig);
    this.$emit("close");
  }
}
</script>

<style lang="scss" scoped>
.typogr-content-label {
  margin-bottom: 1rem;
}

.typogr-setting {
  display: flex;
  gap: 1em;
  justify-content: space-between;
  flex-wrap: nowrap;

  &:deep(.tooltip) {
    min-width: 40ch;
  }
}

.footer {
  display: flex;
  justify-content: space-between;
  margin: -10px;
}
</style>
