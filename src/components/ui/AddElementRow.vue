<template>
  <div class="add-element-row">
    <popup ref="addColumnsPopup">
      <button class="add-element-button">
        <font-awesome-icon icon="columns" size="xs" />
      </button>
      <template v-slot:header>
        Select a layout
      </template>
      <template v-slot:popup>
        <div class="column-templates">
          <div
            class="column-template"
            v-for="(layout, index) of columnLayouts"
            :key="index"
            @click.stop="selectColumnLayout(layout)"
          >
            <div
              class="column"
              v-for="(col, i) of layout"
              :key="i"
              :style="{ 'flex-basis': col + '%' }"
            />
          </div>
        </div>
      </template>
    </popup>

    <button class="add-element" @click.stop="showElements">
      <font-awesome-icon icon="plus" size="xs" />
    </button>

    <popup ref="addFavoritePopup">
      <button class="add-element-button">
        <font-awesome-icon :icon="['fas', 'heart']" size="xs" />
      </button>
      <template v-slot:header>
        Select a favorite
      </template>
      <template v-slot:popup>
        <div class="favorites">
          <preview-element
            v-for="(element, index) in favoriteElements"
            :key="index"
            :element="element"
            no-drag
            @click="addElement(element)"
          />
        </div>
      </template>
    </popup>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import VuexHelper from '@/helper/VuexHelper';
import Popup from "@/components/ui/Popup.vue";
import Tooltip from "@/components/ui/Tooltip.vue";
import { createDefaultHorizontalLayoutElement } from '@/models/layout-elements/HorizontalLayoutElement';
import ElementSelection from '@/models/ElementSelection';
import PreviewElement from "@/components/tools/page/PreviewElement.vue";
import LayoutElement from '@/models/layout-elements/LayoutElement';

const appStore = VuexHelper.createNamespace("appStore");

@Component({ components: { Popup, Tooltip, PreviewElement }})
export default class AddElementRow extends Vue {

  private columnLayouts = [
    [ 50, 50 ],
    [ (100/3), (100/3), (100/3) ],
    [ (100/3), (200/3) ],
    [ (200/3), (100/3) ],
    [ 25, 25, 25, 25 ],
    [ 25, 50, 25 ],
    [ 25, 75 ],
    [ 75, 25 ]
  ];

  private get favoriteElements(): LayoutElement[] {
    return appStore.getters("favoriteElements");
  }

  private get columnsPopup(): Popup | undefined {
    const popupRefs = this.$refs.addColumnsPopup;
    if (popupRefs && (popupRefs as []).length > 0) {
      return (popupRefs as Popup[])[0];
    } else if (popupRefs) {
      return popupRefs as Popup;
    }
    return undefined;
  }

  private get favoritesPopup(): Popup | undefined {
    const popupRefs = this.$refs.addFavoritePopup;
    if (popupRefs && (popupRefs as []).length > 0) {
      return (popupRefs as Popup[])[0];
    } else if (popupRefs) {
      return popupRefs as Popup;
    }
    return undefined;
  }

  private hideAllPopups() {
    if (this.columnsPopup) {
      this.columnsPopup.hide();
    }
    if (this.favoritesPopup) {
      this.favoritesPopup.hide();
    }
  }

  private showElements() {
    this.hideAllPopups();
    appStore.commit("setSelectedTool", "Elements");
  }

  private selectColumnLayout(columnWidths: number[]) {
    this.hideAllPopups();
    const horizontalLayout = createDefaultHorizontalLayoutElement(columnWidths);
    const data: ElementSelection = {
      element: horizontalLayout
    };
    this.$emit("addLayout", data);
  }

  private addElement(element: LayoutElement) {
    this.hideAllPopups();
    const data: ElementSelection = {
      element: element
    };
    this.$emit("addElement", data);
  }
}
</script>

<style lang="scss" scoped>
  @import "@/style/colors.scss";

  .add-element-row {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: $foregroundDark;
    margin-bottom: 5px;

    &::v-deep .tooltip {
      white-space: nowrap;
    }

    button {
      border: none;
      background-color: $primary;
      width: 20px;
      height: 20px;
      border-radius: 10px;
      border: 1px solid $primaryDark;
      display: flex;
      justify-content: center;
      align-items: center;
      color: $foreground;
      font-size: 1rem;
      margin: 5px;
      cursor: pointer;
      box-shadow: 2px 2px 4px 0 $backgroundDark;

      &:hover {
        background-color: $primaryLight;
        border-color: $primary;
      }

      &:focus {
        outline: none;
      }

      &.add-element {
        max-width: 100px;
        flex-grow: 1;

        &-button {
          border-radius: 50%;
          width: 20px;
        }
      }

      &:disabled {
        background-color: $backgroundLight;
        border-color: $background;
        color: $foregroundDark;
        cursor: not-allowed;
      }
    }
  }

  .column-templates {
    width: 250px;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    margin: -5px -5px 0;

    .column-template {
      display: flex;
      justify-content: space-between;
      width: 110px;
      flex: 0 0 auto;
      flex-wrap: nowrap;
      border: 1px solid $foreground;
      padding: 5px;
      margin: 5px;
      cursor: pointer;

      &:hover {
        border-color: $primary;
      }

      .column {
        flex: 1 1 auto;
        background-color: $backgroundLight;
        height: 40px;
        margin: 0 5px;

        &:first-child {
          margin-left: 0;
        }

        &:last-child {
          margin-right: 0;
        }
      }
    }
  }

  .favorites {
    width: 250px;
    justify-content: space-between;
    flex-wrap: wrap;
    display: flex;

    &::v-deep > .element {
      height: 60px;

      .draggable {
        font-size: 3rem;

        .fav {
          font-size: .8rem;
        }
      }
    }
  }
</style>
