import LayoutElement from "@/models/layout-elements/LayoutElement";
import VerticalLayoutElement from "@/models/layout-elements/VerticalLayoutElement";
import HorizontalLayoutElement from "@/models/layout-elements/HorizontalLayoutElement";
import VuexHelper from '@/helper/VuexHelper';
import AppDocument from '@/models/AppDocument';

const appStore = VuexHelper.createNamespace("appStore");

class LayoutElementIdCache {
  private cache: Map<number, LayoutElement> = new Map();

  public build() {
    const document: AppDocument =  appStore.getters<AppDocument>("document");
    for (const page of document.pages) {
      this.addToCache(page.layout);
    }
  }

  private addToCache(element: LayoutElement) {
    if (element.id) {
      this.cache.set(element.id, element);
    }
    if (element.isLayout) {
      const vLayout = element as VerticalLayoutElement;
      const hLayout = element as HorizontalLayoutElement;
      if (vLayout.rows) {
        for (const row of vLayout.rows) {
          this.addToCache(row);
        }
      }
      if (hLayout.columns) {
        for (const column of hLayout.columns) {
          this.addToCache(column.element);
        }
      }
    }
  }

  public add(index: number, layoutElement: LayoutElement) {
    this.cache.set(index, layoutElement);
  }

  public get(index: number | undefined, buildNewIfEmpty?: boolean): LayoutElement | undefined {
    if (index) {
      const layoutElement =  this.cache.get(index);
      if (!layoutElement && buildNewIfEmpty) {
        this.build();
        return this.get(index);
      } else {
        return layoutElement;
      }
    } else {
      return undefined;
    }
  }
}

export const LAYOUT_ELEMENT_CACHE = new LayoutElementIdCache();