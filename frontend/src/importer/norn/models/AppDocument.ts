import AppPage from "@/importer/norn/models/AppPage";
import AppDocumentSettings from "@/importer/norn/models/AppDocumentSettings";

export default interface AppDocument {
  settings: AppDocumentSettings;
  pages: AppPage[];
  nextElementIndex: number;
}
