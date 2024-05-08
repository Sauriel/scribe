<template>
  <div class="table" :class="'table--' + element.type.toLowerCase()">
    <header class="h5" v-if="element.headline">
      {{ element.headline }}
    </header>
    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <live-edit-col
              header
              v-for="(col, index) of element.table.header.cols"
              :key="index"
              :value="col"
              :locked="element.locked"
              :align="col.align"
            />
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, rowIndex) of element.table.rows" :key="rowIndex">
            <live-edit-col
              v-for="(col, colIndex) of row.cols"
              :key="colIndex"
              :value="col"
              :locked="element.locked"
              :align="element.table.header.cols[colIndex].align"
            />
          </tr>
        </tbody>
      </table>
      <table v-if="hasSecondTable">
        <thead>
          <tr>
            <live-edit-col
              header
              v-for="(col, index) of element.secondTable.header.cols"
              :key="index"
              :value="col"
              :locked="element.locked"
              :align="col.align"
            />
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, rowIndex) of element.secondTable.rows" :key="rowIndex">
            <live-edit-col
              v-for="(col, colIndex) of row.cols"
              :key="colIndex"
              :value="col"
              :locked="element.locked"
              :align="element.secondTable.header.cols[colIndex].align"
            />
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import TableElement from '@/models/layout-elements/TableElement';
import LiveEditCol from "@/components/ui/LiveEditCol.vue";

@Component({ components: { LiveEditCol }})
export default class TableElementLayout extends Vue {
  @Prop(Object)
  readonly element!: TableElement;

  private get hasSecondTable(): boolean {
    return !!this.element.secondTable;
  }
}
</script>

<style lang="scss" scoped>
  .table-wrapper {
    display: flex;

    table:nth-child(2) {
      margin-left: 20px;
    }
  }

  .align-left {
    text-align: left;
  }
  
  .align-center {
    text-align: center;
  }
  
  .align-right {
    text-align: right;
  }
</style>
