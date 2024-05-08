import { createApp } from "vue";
import { apolloClient } from "@/apollo";
import { DefaultApolloClient } from "@vue/apollo-composable";
import { FontAwesomeIcon, FontAwesomeLayers } from "@fortawesome/vue-fontawesome";
import { Splitpanes, Pane } from "splitpanes";
import VueGtag from "vue-gtag";
import "splitpanes/dist/splitpanes.css";
import App from "@/App.vue";
//import "@/registerServiceWorker";
import "@/fontAwesomeIcons";
import "@/google-fonts";
import router from "@/router";
import store from "@/store";
import i18n from "@/i18n";
import { historyManager, HISTORY_MANAGER } from "@/history/HistoryManager";
import { apolloService, APOLLO_SERVICE } from "@/services/ApolloService";
import Heading from "@/components/app/ui/heading/Heading.vue";
import Foldout from "@/components/app/ui/foldout/Foldout.vue";
import Tooltip from "@/components/app/ui/tooltip/Tooltip.vue";
import InputField from "@/components/app/ui/input-field/InputField.vue";
import PlusMinusInput from "@/components/app/ui/plus-minus-input/PlusMinusInput.vue";
import SelectBar from "@/components/app/ui/select-bar/SelectBar.vue";
import Btn from "@/components/app/ui/btn/Btn.vue";
import InputSwitch from "@/components/app/ui/input-switch/InputSwitch.vue";
import Dropdown from "@/components/app/ui/dropdown/Dropdown.vue";
import Editable from "@/components/app/ui/editable/Editable.vue";
import TipTap from "@/components/app/ui/tiptap/TipTap.vue";
import FontSelector from "@/components/app/ui/font-selector/FontSelector.vue";
import ColorPicker from "@/components/app/ui/color-picker/ColorPicker.vue";
import Spreadsheet from "@/components/app/ui/spreadsheet/Spreadsheet.vue";
import ImageInput from "@/components/app/ui/image-input/ImageInput.vue";
import Wizard from "@/components/app/ui/wizard/Wizard.vue";
import SortableList from "@/components/app/ui/sortable-list/SortableList.vue";
import Combobox from "@/components/app/ui/combobox/Combobox.vue";
import Info from "@/components/app/ui/info/Info.vue";
import EditableText from "@/components/app/ui/editable-text/EditableText.vue";
import Checkbox from "@/components/app/ui/checkbox/Checkbox.vue";
import ProGuard from "@/components/app/ui/pro-guard/ProGuard.vue";
import CSSEditor from "@/components/app/ui/css-editor/CSSEditor.vue";
import CustomCSS from "@/components/app/ui/custom-css/CustomCSS.vue";
import CreateDocumentModalContent from "@/components/app/modal/create-document/CreateDocumentModalContent.vue";
import OpenDocumentModalContent from "@/components/app/modal/open-document/OpenDocumentModalContent.vue";
import SaveDocumentModalContent from "@/components/app/modal/save-document/SaveDocumentModalContent.vue";
import SpreadsheetModalContent from "@/components/app/modal/spreadsheet/SpreadsheetModalContent.vue";
import TipTapModalContent from "@/components/app/modal/tiptap/TipTapModalContent.vue";
import AboutModalContent from "@/components/app/modal/about/AboutModalContent.vue";
import GlobalSettingsModalContent from "@/components/app/modal/global-settings/GlobalSettingsModalContent.vue";
import ImageExportModalContent from "@/components/app/modal/export/image/ImageExportModalContent.vue";
import ImportDocumentModalContent from "@/components/app/modal/import/ImportDocumentModalContent.vue";
import LoginRegisterModalContent from "@/components/app/modal/login-register/LoginRegisterModalContent.vue";
import AddLinkDialogContent from "@/components/app/dialog/link/AddLinkDialogContent.vue";
import AddImageDialogContent from "@/components/app/dialog/image/add/AddImageDialogContent.vue";
import TypogrDialogContent from "@/components/app/dialog/typogr/TypogrDialogContent.vue";
import ImageSelectDialogContent from "@/components/app/dialog/image/select/ImageSelectDialogContent.vue";
import ConfirmDialogContent from "@/components/app/dialog/confirm/ConfirmDialogContent.vue";
import ChangelogModalContent from "@/components/app/modal/changelog/ChangelogModalContent.vue";
import {
  CREATE_DOCUMENT_COMPONENT_TAG,
  SPREADSHEET_MODAL_COMPONENT_TAG,
  OPEN_DOCUMENT_COMPONENT_TAG,
  SAVE_DOCUMENT_COMPONENT_TAG,
  TIPTAP_MODAL_COMPONENT_TAG,
  ABOUT_US_COMPONENT_TAG,
  GLOBAL_SETTINGS_COMPONENT_TAG,
  IMAGE_EXPORT_COMPONENT_TAG,
  IMPORT_COMPONENT_TAG,
  LOGIN_REGISTER_COMPONENT_TAG,
  CHANGELOG_COMPONENT_TAG
} from "@/events/modal";
import {
  ADD_LINK_TAG,
  ADD_IMAGE_TAG,
  TYPOGR_TAG,
  IMAGE_INPUT_TAG,
  CONFIRM_TAG,
} from "@/events/dialog";
// @ts-ignore
import vClickOutside from "click-outside-vue3";
import { addLayoutElements } from "@/modules";
import { SaveHtmlDirective } from "@/directives/SaveHtmlDirective";

const app = createApp(App)
  .use(i18n)
  .use(store)
  .use(router)
  .use(vClickOutside)
  .use(VueGtag, {
    bootstrap: false,
    config: {
      id: import.meta.env.VITE_GTAG_ID,
    },
    router,
  })
  .provide(HISTORY_MANAGER, historyManager)
  .provide(DefaultApolloClient, apolloClient)
  .provide(APOLLO_SERVICE, apolloService)
  .directive("safe-html", SaveHtmlDirective)
  .component("font-awesome-icon", FontAwesomeIcon)
  .component("font-awesome-layers", FontAwesomeLayers)
  .component("splitpanes", Splitpanes)
  .component("pane", Pane)

  .component(CREATE_DOCUMENT_COMPONENT_TAG, CreateDocumentModalContent)
  .component(OPEN_DOCUMENT_COMPONENT_TAG, OpenDocumentModalContent)
  .component(SAVE_DOCUMENT_COMPONENT_TAG, SaveDocumentModalContent)
  .component(SPREADSHEET_MODAL_COMPONENT_TAG, SpreadsheetModalContent)
  .component(TIPTAP_MODAL_COMPONENT_TAG, TipTapModalContent)
  .component(ABOUT_US_COMPONENT_TAG, AboutModalContent)
  .component(GLOBAL_SETTINGS_COMPONENT_TAG, GlobalSettingsModalContent)
  .component(IMAGE_EXPORT_COMPONENT_TAG, ImageExportModalContent)
  .component(IMPORT_COMPONENT_TAG, ImportDocumentModalContent)
  .component(LOGIN_REGISTER_COMPONENT_TAG, LoginRegisterModalContent)
  .component(CHANGELOG_COMPONENT_TAG, ChangelogModalContent)

  .component(ADD_LINK_TAG, AddLinkDialogContent)
  .component(ADD_IMAGE_TAG, AddImageDialogContent)
  .component(TYPOGR_TAG, TypogrDialogContent)
  .component(IMAGE_INPUT_TAG, ImageSelectDialogContent)
  .component(CONFIRM_TAG, ConfirmDialogContent)

  .component("heading", Heading)
  .component("foldout", Foldout)
  .component("tooltip", Tooltip)
  .component("input-field", InputField)
  .component("plus-minus-input", PlusMinusInput)
  .component("select-bar", SelectBar)
  .component("btn", Btn)
  .component("input-switch", InputSwitch)
  .component("dropdown", Dropdown)
  .component("editable", Editable)
  .component("tip-tap", TipTap)
  .component("font-selector", FontSelector)
  .component("spreadsheet", Spreadsheet)
  .component("image-input", ImageInput)
  .component("color-picker", ColorPicker)
  .component("sortable-list", SortableList)
  .component("wizard", Wizard)
  .component("combobox", Combobox)
  .component("info", Info)
  .component("editable-text", EditableText)
  .component("checkbox", Checkbox)
  .component("pro-guard", ProGuard)
  .component("css-editor", CSSEditor)
  .component("custom-css", CustomCSS);

addLayoutElements(app);

app.mount("#app");