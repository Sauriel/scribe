import AppPage from "@/models/AppPage";
import AppDocumentSettings from "@/models/AppDocumentSettings";

export default interface AppDocument {
  settings: AppDocumentSettings;
  pages: AppPage[];
  nextElementIndex: number;
}