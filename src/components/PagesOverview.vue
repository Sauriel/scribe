<template>
  <div class="pages-overview">
    <div class="pages-actions">
      <btn icon="plus" text="Add Page" @click="addPage" />
    </div><div class="pages-overview-list">
    <drop
      @drop="handleDrop($event, 0)"
      class="dropable"
        :class="{
          'dropable--big': isDragging,
          'dropable--over': dragOverReactive === -1
          }"
        @dragover="handleDragOver(-1, ...arguments)"
        @dragleave="dragOverReactive = null"
      />
    <div v-for="(page, index) in pagesReactive" :key="index">
      <drag
        class="overview-page"
        :transfer-data="{ page, index }"
        :class="{'overview-page--selected': index === selectedIndex}"
        @dragstart="dragging = page"
        @dragend="dragging = null"
      >
        <div
          class="resized-page"
          :style="pageFormat"
          @click="selectPage(page, index)"
        >
          <page
            :page-number="index + 1"
            :page="page"
            :is-preview="true"
          />
          <div class="mouse-blocker" />
        </div>
        <div class="overview-page-options">
          <btn icon="cog" text="Edit" @click="openPageSettings(page, index)" />
          <btn icon="trash-alt" alert @click="deletePage(page, index)" />
        </div>
      </drag>
      <drop
        @drop="handleDrop($event, index + 1)"
        class="dropable"
        :class="{
          'dropable--big': isDragging,
          'dropable--over': dragOverReactive === index
        }"
        @dragover="handleDragOver(index, ...arguments)"
        @dragleave="dragOverReactive = null"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import AppPage from "@/models/AppPage";
import Page from "@/components/Page.vue";
import VuexHelper from "@/helper/VuexHelper";
import PageHelper from "@/helper/PageHelper";
import AppDocument from '@/models/AppDocument';
import { EventBus, EVENTS, ShowPageEvent } from '@/eventBus';
import { PageFormat } from '@/models/AppDocumentSettings';

export interface PageSelection {
  page: AppPage;
  index: number;
}

export interface PageMoveEvent {
  page: AppPage;
  from: number;
  to: number;
}

const appStore = VuexHelper.createNamespace("appStore");

@Component({ components: { Page }})
export default class PagesOverview extends Vue {

  private get selectedIndex(): number {
    return appStore.getters<number>("selectedPageId");
  }

  private set selectedIndex(value: number) {
    appStore.commit("setSelectedPageId", value);
  }

  private get pages(): AppPage[] {
    const document: AppDocument = appStore.getters<AppDocument>("document");
    return document ? document.pages : [];
  }

  private dragging: AppPage | null = null;
  private dragOver: number | null = null;

  private get pagesReactive(): AppPage[] {
    return this.pages && this.pages.length > 0 ? this.pages : [];
  }

  private get isDragging(): boolean {
    return !!this.dragging;
  }

  private get dragOverReactive(): number | null {
    return this.dragOver;
  }

  private set dragOverReactive(value: number | null) {
    this.dragOver = value;
  }

  private get pageFormat(): Record<string, string> {
    const page: PageFormat = appStore.getters<PageFormat>("documentPageFormat");
    return {
      width: (page.width * 0.2) + page.unit,
      height: (page.height * 0.2) + page.unit
    };
  }

  private addPage() {
    const document: AppDocument = appStore.getters<AppDocument>("document");
    const nextPageNumber = this.pages.length + 1;
    this.pages.push(PageHelper.createEmpty(document.nextElementIndex++))
    if (this.selectedIndex < 0) {
      this.selectedIndex = 0;
    }
  }

  private selectPage(page: AppPage, index: number) {
    this.selectedIndex = index;
    const showPageEvent: ShowPageEvent = {
      id: index,
      scroll: true
    };
    EventBus.$emit(EVENTS.SHOW_PAGE, showPageEvent);
  }

  private deletePage(page: AppPage, index: number) {
    this.pages.splice(index, 1);
    if (this.selectedIndex === this.pages.length) {
      this.selectedIndex--;
    }
  }

  private handleDragOver(index: number, data: PageSelection, event: DragEvent) {
    if ((!data || !data.page) && event.dataTransfer) { // This is propably no page
      event.dataTransfer.dropEffect = "none";
    } else if (event.dataTransfer && data && ((index + 1 === data.index) || (index === data.index)) ) { // can not drop an before or after itself
      event.dataTransfer.dropEffect = "none";
    } else {
      this.dragOverReactive = index;
    }
  }

  private handleDrop(data: PageSelection, index: number) {
    this.dragOverReactive = null;
    const from = data.index;
    const to = index;
    const selectedPage = this.pages[this.selectedIndex];
    if (from > to) {
      this.pages.splice(from, 1); // delete from: from
      this.pages.splice(to, 0, data.page); // insert into: to
    } else if (from < to) {
      this.pages.splice(to, 0, data.page); // insert into: to
      this.pages.splice(from, 1); // delete from: from
    }
    const newSelectedIndex = this.pages.indexOf(selectedPage);
    this.selectedIndex = newSelectedIndex;
    const showPageEvent: ShowPageEvent = {
      id: newSelectedIndex,
      scroll: false
    };
    EventBus.$emit(EVENTS.SHOW_PAGE, showPageEvent);
  }

  private openPageSettings(page: AppPage, index: number) {
    appStore.commit("setSelectedPageId", index);
    const showPageEvent: ShowPageEvent = {
      id: index,
      scroll: false
    };
    EventBus.$emit(EVENTS.SHOW_PAGE, showPageEvent);
    appStore.commit("setEditingPage", page);
    appStore.commit("setSelectedTool", "Settings");
    appStore.commit("setSettingsSubTool", "PageSettings");
  }
}
</script>

<style lang="scss" scoped>
  @import "@/style/colors.scss";

  .pages-overview {
    background-color: $background;
    width: 200px;

    @media print {
      display: none;
    }

    .pages-actions {
      display: flex;
      height: 50px;
    }

    .pages-overview-list {
      display: flex;
      flex-direction: column;
      align-items: center;
      overflow-y: scroll;
      height: calc(100vh - 50px);

      .dropable {
        width: 100%;
        height: 1px;

        &--big {
          height: 20px;
        }

        &--over {
          height: 30px;
          position: relative;

          &::after {
            position: absolute;
            content: "";
            left: 10px;
            right: 10px;
            top: 13px;
            bottom: 13px;
            background-color: $info;
          }
        }
      }

      .overview-page {
        flex: 0 0 auto;
        margin: 4px 0;;
        position: relative;

        & > .resized-page {
          cursor: move;
          position: relative;

          & > .mouse-blocker {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
          }

          &::v-deep > .page {
            transform: scale(.2);
            transform-origin: top left;

            * {
              outline: none !important;
            }

            .drop-zone--last {
              display: none !important;
            }
          }
        }

        &--selected::after {
          position: absolute;
          top: -2px;
          left: -2px;
          bottom: -2px;
          right: -2px;
          content: "";
          display: block;
          border: 4px solid $alert;
          pointer-events: none;
        }

        &:hover {
          .overview-page-options {
            display: flex;
          }
        }

        .overview-page-options {
          background-color: rgba(0, 0, 0, 0.5);
          position: absolute;
          bottom: 10px;
          left: 10px;
          right: 10px;
          display: none;
          z-index: 1;

          &::v-deep > button {
            margin: 5px;
          }
        }
      }
    }
  }
</style>
