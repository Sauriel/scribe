<template>
  <div class="edit-text">
    <heading>{{ $t("tiptap-editor.header") }}</heading>
    <div class="edit-text-content">
      <tip-tap v-model="text" :defaults="defaults" :historyConfig="tipTapHistoryConfig" />
    </div>
    <footer>
      <btn outline @click="$emit('close')">{{ $t("tiptap-editor.close") }}</btn>
    </footer>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Options } from "vue-property-decorator";
import { TipTapDefaults, TipTapHistoryConfig, TipTapModalPayload } from "@/components/app/ui/tiptap/TipTap.vue";

@Options({
  emits: ["close"],
})
export default class TipTapModalContent extends Vue {
  @Prop({ type: Object, required: true })
  private readonly payload!: TipTapModalPayload<unknown>;

  private get text(): string {
    return this.payload.config.get(this.payload.config.object);
  }

  private set text(value: string) {
    this.payload.config.set(this.payload.config.object, value);
  }

  private get defaults(): TipTapDefaults {
    return this.payload.defaults;
  }

  private get tipTapHistoryConfig(): TipTapHistoryConfig<unknown> {
    return this.payload.config;
  }
}
</script>

<style lang="scss" scoped>
.edit-text {
  flex: 1 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  &-content {
    flex: 1 0 auto;
    display: flex;
    flex-direction: column;
    margin: 1rem 0;

    > .tip-tap {
      height: 100%;
      display: flex;
      flex-direction: column;

      &:deep(.tip-tap-menu) {
        flex: 0 0 auto;
      }
    }

    &:deep(.tip-tap > div) {
      flex: 1 0 auto;

      .ProseMirror {
        height: 100%;
        max-height: calc(100vh - 210px - 8rem);
        overflow-y: auto;
      }
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
