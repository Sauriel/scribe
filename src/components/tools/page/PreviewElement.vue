<template>
  <div class="element" :class="element.component">
    <tooltip position="right" v-if="dragable">
      <drag
        class="draggable"
        :transfer-data="{ element }"
        @dragstart="dragging = element"
        @dragend="dragging = null"
      >
        <font-awesome-icon :icon="element.icon" />
        <span class="fav">
          <font-awesome-icon :icon="[isFavorite ? 'fas' : 'far', 'heart']" @click="toggleFavorite" />
        </span>
      </drag>
      <template v-slot:tooltip>
        <div class="element-preview">
          <img v-if="element.preview" :src="element.preview" />
        </div>
      </template>
    </tooltip>
    <div v-else class="draggable clickable" @click="$emit('click', $event)">
      <font-awesome-icon :icon="element.icon" />
      <span class="fav">
        <font-awesome-icon :icon="[isFavorite ? 'fas' : 'far', 'heart']" @click.stop="toggleFavorite" />
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import LayoutElement from '@/models/layout-elements/LayoutElement';
import { Component, Vue, Prop } from 'vue-property-decorator';
import VuexHelper from '@/helper/VuexHelper';
import Tooltip from "@/components/ui/Tooltip.vue";

const layoutStore = VuexHelper.createNamespace("layoutStore");
const appStore = VuexHelper.createNamespace("appStore");

@Component({ components: { Tooltip }})
export default class PreviewElement extends Vue {

  @Prop(Object)
  readonly element!: LayoutElement;

  @Prop({ type: Boolean, default: false })
  readonly noDrag!: boolean;

  private get dragable(): boolean {
    return !this.noDrag;
  }

  private get dragging(): LayoutElement | undefined {
    return layoutStore.getters("draggingElement");
  }

  private set dragging(value: LayoutElement | undefined) {
    layoutStore.commit("setDraggingElement", value);
  }

  private get favorites(): LayoutElement[] {
    return appStore.getters("favoriteElements");
  }

  private get isFavorite(): boolean {
    return !!this.favorites.find(fav => fav.component == this.element.component);
  }

  private toggleFavorite(evt: MouseEvent) {
    if (this.isFavorite) {
      appStore.commit("removeFavoriteElement", this.element);
    } else {
      appStore.commit("addFavoriteElement", this.element);
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/style/colors.scss";

  .element {
    height: 100px;
    flex: 0 1 40%;
    margin: 10px;
    background-color: $backgroundLight;

    > .tooltip-wrapper {
      height: 100%;
      width: 100%;

      &::v-deep > .tooltip-trigger {
        height: 100%;
        width: 100%;
      } 
    }

    .draggable {
      height: 100%;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      font-size: 5rem;
      cursor: move;
      position: relative;

      &.clickable {
        cursor: pointer;
      }

      .fav {
        position: absolute;
        font-size: 1.2rem;
        top: 5px;
        right: 5px;
        cursor: pointer;
      }
    }
  }

  .element-preview {
    width: 200px;
    min-height: 100px;
    margin: -2px -7px;
    border-radius: 6px;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;

    > img {
      width: 100%;
      height: auto;
    }
  }
</style>
