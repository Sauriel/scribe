<script lang="ts">
import { Vue, Options } from "vue-property-decorator";
import MenuDropdown, { DropdownEntry } from "@/components/app/ui/menu-dropdown/MenuDropdown.vue";
import { ROUTE_NAMES } from "@/router";
import VuexHelper from "@/helper/VuexHelper";
import { GLOBAL_STORE_NAMESPACE } from "@/store/global/globalStoreModule";
import { GlobalStoreGetters } from "@/store/global/globalStoreGetters";
import { AppLocale } from "@/store/global/globalStoreState";
import { LocaleChangedEvent, LOCALE_CHANGED_EVENT_NAME } from "@/events/locale";
import emitter from "@/emitter";
import DocumentModel from "@/models/document";
import { DOCUMENT_STORE_NAMESPACE } from "@/store/document/documentStoreModule";
import { DocumentStoreGetters } from "@/store/document/documentStoreGetters";
import {
  ABOUT_US_COMPONENT_TAG,
  GLOBAL_SETTINGS_COMPONENT_TAG,
  IMPORT_COMPONENT_TAG,
  ModalUpdateEvent,
  MODAL_UPDATE_EVENT_NAME,
  OPEN_DOCUMENT_COMPONENT_TAG,
  SAVE_DOCUMENT_COMPONENT_TAG,
  LOGIN_REGISTER_COMPONENT_TAG,
  CHANGELOG_COMPONENT_TAG,
} from "@/events/modal";
import { CREATE_DOCUMENT_COMPONENT_TAG } from "@/events/modal";
import { LAYOUT_STORE_NAMESPACE } from "@/store/layout/layoutStoreModule";
import { LayoutStoreGetters } from "@/store/layout/layoutStoreGetters";
import HistoryManager, { HISTORY_MANAGER } from "@/history/HistoryManager";
import { COMPONENT_NAME as EDIT_PANEL_DOCUMENT_DEFAULTS } from "@/components/app/edit/document-defaults/DocumentDefaultsEditPanel.vue";
import { COMPONENT_NAME as EDIT_PANEL_PAGE_BACKGROUND } from "@/components/app/edit/background/PageBackgroundEditPanel.vue";
import { COMPONENT_NAME as EDIT_PANEL_PAGE_BACKGROUND_IMAGE } from "@/components/app/edit/background/image/PageBackgroundImagesEditPanel.vue";
import EditPanelHelper from "@/helper/EditPanelHelper";
import { SaveDocumentPayload } from "@/components/app/modal/save-document/SaveDocumentModalContent.vue";
import { HISTORY_CHANGED_EVENT_NAME } from "@/events/history";
import { USER_STORE_NAMESPACE } from "@/store/user/userStoreModule";
import { UserStoreGetters } from "@/store/user/userStoreGetters";
import { UserStoreActions } from "@/store/user/userStoreActions";
import { LogoutMutation, User } from "@/graphql/user/models";
import ApolloService, { APOLLO_SERVICE } from "@/services/ApolloService";
import logoutSchema from "@/graphql/user/logout.gql";
import RightsHelper from "@/helper/RightsHelper";

const layoutStore = VuexHelper.createNamespace(LAYOUT_STORE_NAMESPACE);
const globalStore = VuexHelper.createNamespace(GLOBAL_STORE_NAMESPACE);
const documentStore = VuexHelper.createNamespace(DOCUMENT_STORE_NAMESPACE);
const userStore = VuexHelper.createNamespace(USER_STORE_NAMESPACE);

interface RouterLink {
  label: string;
  to: Location;
  disabled?: boolean;
}

interface Location {
  name: string;
}

@Options({
  components: {
    MenuDropdown,
  },
  inject: [ HISTORY_MANAGER, APOLLO_SERVICE ],
})
export default class TopBar extends Vue {
  private get history(): HistoryManager {
    // @ts-ignore
    return this.historyManager;
  }

  private get apollo(): ApolloService {
    // @ts-ignore
    return this.apolloService;
  }

  private historyHash = 0;

  created() {
    emitter.$on(HISTORY_CHANGED_EVENT_NAME, () => this.historyHash++);
  }

  private get isLoggedIn(): boolean {
    return userStore.getters<boolean>(UserStoreGetters.IS_LOGGED_IN) || false;
  }

  private get user(): User | undefined {
    return userStore.getters<User>(UserStoreGetters.USER);
  }

  private get username(): string {
    return this.user?.username || "";
  }

  private get isPatreonSupporter(): boolean {
    return this.user?.patreon?.status === "active_patron";
  }

  private get appVersion(): string {
    return import.meta.env.PACKAGE_VERSION ;
  }

  private get scribeVersion(): string {
    if (RightsHelper.isProMember(this.user)) {
      return this.$t("global.app.version.pro");
    } else {
      return this.$t("global.app.version.normal");
    }
  }

  private undo() {
    this.history.undo();
  }

  private redo() {
    this.history.redo();
  }

  private get selectedEditPanel(): string {
    return layoutStore.getters(LayoutStoreGetters.EDIT_PANEL_COMPONENT) || "";
  }

  private set selectedEditPanel(value: string) {
    if (value && value !== "") {
      EditPanelHelper.setElementEditPanel({ component: value });
    }
  }

  private get documentMenuEntries(): DropdownEntry[] {
    return [
      {
        label: this.$t("top-bar.document.defaults"),
        value: EDIT_PANEL_DOCUMENT_DEFAULTS,
      },
    ];
  }

  private get pageMenuEntries(): DropdownEntry[] {
    return [
      {
        label: this.$t("top-bar.page.background"),
        value: EDIT_PANEL_PAGE_BACKGROUND,
      },
      {
        label: this.$t("top-bar.page.images"),
        value: EDIT_PANEL_PAGE_BACKGROUND_IMAGE,
      },
    ];
  }

  private get views(): RouterLink[] {
    return [ ROUTE_NAMES.home, ROUTE_NAMES.edit, ROUTE_NAMES.library ].map((name) => this.toRouterLink(name));
  }

  private toRouterLink(name: string): RouterLink {
    return {
      label: "top-bar.view." + name.toLowerCase(),
      disabled:
        name === ROUTE_NAMES.edit ? !this.document : false,
      to: {
        name: name,
      },
    };
  }

  private get profileRoute(): Location {
    return {
      name: ROUTE_NAMES.profile
    }
  }

  private get locale(): string {
    return globalStore.getters(GlobalStoreGetters.LOCALE) || "en";
  }

  private set locale(value: string) {
    const event: LocaleChangedEvent = {
      name: LOCALE_CHANGED_EVENT_NAME,
      payload: value as AppLocale,
    };
    emitter.$emit(LOCALE_CHANGED_EVENT_NAME, event);
  }

  private get languages(): DropdownEntry[] {
    return [
      {
        label: this.$t("top-bar.language-switcher.en"),
        value: "en",
        prependImg: "@/assets/images/languages/english_language_flag.svg",
      },
      {
        label: this.$t("top-bar.language-switcher.de"),
        value: "de",
        prependImg: "@/assets/images/languages/german_language_flag.svg",
      },
    ];
  }

  private get document(): DocumentModel | undefined {
    return documentStore.getters(DocumentStoreGetters.DOCUMENT);
  }

  private createNewDocument() {
    const event: ModalUpdateEvent<unknown> = {
      name: MODAL_UPDATE_EVENT_NAME,
      payload: {
        component: CREATE_DOCUMENT_COMPONENT_TAG,
        visible: true,
      },
    };
    emitter.$emit(MODAL_UPDATE_EVENT_NAME, event);
  }

  private openDocument() {
    const event: ModalUpdateEvent<unknown> = {
      name: MODAL_UPDATE_EVENT_NAME,
      payload: {
        component: OPEN_DOCUMENT_COMPONENT_TAG,
        visible: true,
      },
    };
    emitter.$emit(MODAL_UPDATE_EVENT_NAME, event);
  }

  private saveDocument() {
    if (this.document) {
      const event: ModalUpdateEvent<SaveDocumentPayload> = {
        name: MODAL_UPDATE_EVENT_NAME,
        payload: {
          component: SAVE_DOCUMENT_COMPONENT_TAG,
          visible: true,
          payload: {
            document: this.document,
          },
        },
      };
      emitter.$emit(MODAL_UPDATE_EVENT_NAME, event);
    }
  }

  private openSettings() {
    const event: ModalUpdateEvent<undefined> = {
      name: MODAL_UPDATE_EVENT_NAME,
      payload: {
        component: GLOBAL_SETTINGS_COMPONENT_TAG,
        visible: true,
      },
    };
    emitter.$emit(MODAL_UPDATE_EVENT_NAME, event);
  }

  private openExport() {
    EditPanelHelper.showExportPanel();
  }

  private openImport() {
    const event: ModalUpdateEvent<undefined> = {
      name: MODAL_UPDATE_EVENT_NAME,
      payload: {
        component: IMPORT_COMPONENT_TAG,
        visible: true,
      },
    };
    emitter.$emit(MODAL_UPDATE_EVENT_NAME, event);
  }

  private openInfo() {
    const event: ModalUpdateEvent<undefined> = {
      name: MODAL_UPDATE_EVENT_NAME,
      payload: {
        component: ABOUT_US_COMPONENT_TAG,
        visible: true,
      },
    };
    emitter.$emit(MODAL_UPDATE_EVENT_NAME, event);
  }

  private openLoginRegister() {
    const event: ModalUpdateEvent<undefined> = {
      name: MODAL_UPDATE_EVENT_NAME,
      payload: {
        component: LOGIN_REGISTER_COMPONENT_TAG,
        visible: true,
        noMinWidth: true,
      },
    };
    emitter.$emit(MODAL_UPDATE_EVENT_NAME, event);
  }

  private logout() {
    const user = userStore.getters<User>(UserStoreGetters.USER);
    if (user) {
      this.apollo
        .mutation<LogoutMutation>(logoutSchema, { userId: user.id }, true)
        .then(data => {
          if (!data.logout) {
            console.error("Logout on server not successful.", data)
          }
          userStore.dispatch(UserStoreActions.USER, undefined);
          this.$router.push({ name: ROUTE_NAMES.home });
        })
        .catch(e => {
          console.error(e);
        });
    }
  }

  private showChangelog() {
    const event: ModalUpdateEvent<unknown> = {
      name: MODAL_UPDATE_EVENT_NAME,
      payload: {
        component: CHANGELOG_COMPONENT_TAG,
        visible: true,
      },
    };
    emitter.$emit(MODAL_UPDATE_EVENT_NAME, event);
  }
}
</script>

<template src="@/components/app/global/top-bar/top-bar.template.html" />
<style src="@/components/app/global/top-bar/top-bar.style.scss" lang="scss" scoped />
