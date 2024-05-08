<template>
  <div class="pages">
    <page
      v-for="(page, index) in pages"
      :key="index"
      :index="index"
      :page="page"
      :ref="'page-id-' + index"
      v-waypoint="{ active: true, callback: onWaypoint, options: intersectionOptions }"
    />
    <save-and-load-buttons />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import AppPage from "@/models/AppPage";
import Page from "@/components/Page.vue";
import SaveAndLoadButtons from "@/components/ui/SaveAndLoadButtons.vue";
import VuexHelper from "@/helper/VuexHelper";
import AppDocument from '@/models/AppDocument';
import { EventBus, EVENTS, ShowPageEvent } from '@/eventBus';

interface Waypoint {
  el: Node;
  going: string; // in, out
  direction: string; // top, right, bottom, left
  _entry: IntersectionObserverEntry;
}

const appStore = VuexHelper.createNamespace("appStore");

@Component({ components: { Page, SaveAndLoadButtons }})
export default class Pages extends Vue {
  private intersectionOptions = {
    root: null,
    rootMargin: '0px 0px 0px 0px',
    threshold: [0, 1]
  };

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

  mounted() {
    EventBus.$on(EVENTS.SHOW_PAGE, this.onShowPageEvent);
  }

  private onShowPageEvent(event: ShowPageEvent) {
    const element = this.getElementByIndex(event.id);
    if (event.scroll) {
      element.scrollIntoView({ behavior: "smooth"});
    } else {
      element.scrollIntoView();
    }
  }

  private onWaypoint(waypoint: Waypoint) {
    if (waypoint.direction) {
      // @ts-ignore
      const index = +waypoint.el.dataset.index;
      if (waypoint.going === "out" && this.selectedIndex === index) {
        let nextIndex = index;
        if (waypoint.direction === "top") {
          nextIndex = index + 1;
        } else if (waypoint.direction === "bottom") {
          nextIndex = index - 1;
        }
        this.selectedIndex = nextIndex;
      }
    }
  }

  private getElementByIndex(index: number): Element {
    const selectedElement = this.$refs["page-id-" + index] as Vue[];
    return selectedElement[0].$el;
  }
}
</script>

<style lang="scss" scoped>
.pages {
    flex: 1 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow-y: scroll;
    height: 100vh;

    @media print {
      overflow-y: auto;
      height: auto;
    }

    & > * {
      flex: 0 0 auto;
      margin: 10px 0;

      @media print {
        margin: 0;
      }
    }

    &.hidden-tools {
      ::v-deep {
        * {
          outline: none !important;
        }

        .element-wrapper-options,
        .drop-zone--last,
        .arrow {
          display: none !important;
        }
      }
    }
  }
</style>
