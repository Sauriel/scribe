<template>
  <div>
    <div class="settings-row">
      <label>
        Type:
        <dropdown
          :items="types"
          v-model="element.type"
          :disabled="element.locked"
        />
      </label>
      <switch-input v-model="showSecondTable" :disabled="element.locked">
        Double Table
      </switch-input>
    </div>
    <switch-input v-model="showHeadline" :disabled="element.locked">
      Headline
      <text-input v-if="showHeadline" v-model="element.headline" :disabled="element.locked" class="header-input" />
    </switch-input>
    <btn icon="edit" text="Edit the table" full-width @click="toggleModal" :disabled="element.locked" />
    <modal
      v-if="!element.locked"
      name="table-element-modal"
      :width="Math.min(modalMaxWidth, 800)"
      :height="Math.min(modalMaxHeight, 600)"
      :maxWidth="modalMaxWidth"
      :maxHeight="modalMaxHeight"
      resizable
      draggable=".modal-header"
    >
      <header class="modal-header">
        Edit the Table
      </header>
      <div class="scrollable">
        <table-settings id="first-table" v-model="element.table" class="modal-table" />
        <table-settings id="second-table" v-if="element.secondTable" v-model="element.secondTable" class="modal-table" />
      </div>
      <footer class="modal-footer">
        <btn @click="toggleModal">
          Close
        </btn>
      </footer>
    </modal>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import TableElement, { TableType, createTable } from '@/models/layout-elements/TableElement';
import Dropdown, { DropdownItem } from "@/components/ui/Dropdown.vue";
import SwitchInput from "@/components/ui/SwitchInput.vue";
import TableSettings from "@/components/layout-elements/settings/table/TableSettings.vue";

@Component({ components: { TableSettings, Dropdown, SwitchInput }})
export default class TableElementLayoutSettings extends Vue {
  @Prop(Object)
  readonly element!: TableElement;

  private get showHeadline(): boolean {
    return !!this.element.headline;
  }

  private set showHeadline(value: boolean) {
    this.element.headline = value ? "Headline" : "";
  }

  private get showSecondTable(): boolean {
    return !!this.element.secondTable;
  }

  private set showSecondTable(value: boolean) {
    if (value) {
      this.element.secondTable = createTable({rows: 4, cols: 3});
    } else {
      this.element.secondTable = null;
    }
  }

  private get types(): DropdownItem[] {
    const types: DropdownItem[] = [
      { name: "Simple", value: TableType.SIMPLE },
      { name: "Class", value: TableType.CLASS }
      ];
    return types;
  }

  private get modalMaxWidth(): number {
    return window.innerWidth - 100;
  }

  private get modalMaxHeight(): number {
    return window.innerHeight - 100;
  }

  private toggleModal() {
    this.$modal.toggle("table-element-modal");
  }
}
</script>

<style lang="scss" scoped>
@import "@/style/colors.scss";

label {
  display: flex;
  align-items: center;
  margin-bottom: 10px;;

  .dropdown {
    margin-left: 10px;
  }

  .header-input {
    flex: 1 1 auto;
    width: auto;
  }
}

.settings-row {
  display: flex;
  justify-content: space-between;
}

.scrollable {
  overflow: auto;
  padding-bottom: 10px;
  max-height: calc(100% - 30px);
}

::v-deep .vm--modal {
  display: flex;
  flex-direction: column;

  .scrollable {
    flex: 1 1 auto;
  }
}

.modal-header {
  flex: 0 0 auto;
  display: flex;
  justify-content: center;
  height: 30px;
  align-items: center;
  background-color: $foreground;
  color: $background;
  cursor: move;
}

.modal-table {
  margin: 20px;
}

.modal-footer {
  flex: 0 0 auto;
  display: flex;
  justify-content: flex-end;
}
</style>
