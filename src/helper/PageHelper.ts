import AppPage from "@/models/AppPage";

export default class PageHelper {
  public static createEmpty(elementId: number): AppPage {
    return {
      backgroundImages: [],
      layout: {
        component: "VerticalLayout",
        isLayout: true,
        id: elementId,
        rows: [],
        locked: false,
        preview: false
      }
    };
  }
}