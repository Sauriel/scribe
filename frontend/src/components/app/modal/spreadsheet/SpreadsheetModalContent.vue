<template>
  <div class="edit-table">
    <heading :info="$t('spreadsheet-editor.info')">{{ $t("spreadsheet-editor.header") }}</heading>
    <div class="edit-table-content">
      <spreadsheet v-model="payload.table" :actions="payload.actions" />
    </div>
    <footer>
      <btn outline @click="cancel">{{ $t("spreadsheet-editor.cancel") }}</btn>
      <btn @click="save">{{ $t("spreadsheet-editor.save") }}</btn>
    </footer>
  </div>
</template>

<script lang="ts">
import { Table, TablePayload } from "@/models/document/table";
import { Vue, Prop, Options } from "vue-property-decorator";

@Options({
  emits: ["close"],
})
export default class SpreadsheetModalContent extends Vue {
  @Prop({ type: Object, required: true })
  private readonly payload!: TablePayload;

  private cancel() {
    if (this.payload.onCancel) {
      this.payload.onCancel(this.payload.table);
    }
    this.$emit("close");
  }

  private save() {
    if (this.payload.onSave) {
      this.payload.onSave(this.payload.table);
    }
    this.$emit("close");
  }
}
</script>

<style lang="scss" scoped>
.edit-table {
  flex: 1 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  &-content {
    flex: 1 0 auto;
    display: flex;
    flex-direction: column;
    margin: 1rem 0;
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
