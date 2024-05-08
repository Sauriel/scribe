<script lang="ts">
import { Vue } from "vue-class-component";
import emitter from "@/emitter";
import { CHANGELOG_COMPONENT_TAG, ModalUpdateEvent, MODAL_UPDATE_EVENT_NAME } from "@/events/modal";
import { CREATE_DOCUMENT_COMPONENT_TAG, OPEN_DOCUMENT_COMPONENT_TAG, LOGIN_REGISTER_COMPONENT_TAG } from "@/events/modal";
import VuexHelper from "@/helper/VuexHelper";
import { DOCUMENT_STORE_NAMESPACE } from "@/store/document/documentStoreModule";
import { DocumentStoreGetters } from "@/store/document/documentStoreGetters";
import LocalForageHelper from "@/helper/LocalForageHelper";
import DocumentStoreHelper from "@/helper/DocumentStoreHelper";
import { DocumentStoreMutations } from "@/store/document/documentStoreMutations";
import { ROUTE_NAMES } from "@/router";
import { USER_STORE_NAMESPACE } from "@/store/user/userStoreModule";
import { UserStoreGetters } from "@/store/user/userStoreGetters";
import RightsHelper from "@/helper/RightsHelper";
import { User } from "@/graphql/user/models";

interface Location {
  name: string;
}

const documentStore = VuexHelper.createNamespace(DOCUMENT_STORE_NAMESPACE);
const userStore = VuexHelper.createNamespace(USER_STORE_NAMESPACE);

export default class Home extends Vue {

  private get isLoggedIn(): boolean {
    return userStore.getters<boolean>(UserStoreGetters.IS_LOGGED_IN) || false;
  }

  private get user(): User | undefined {
    return userStore.getters<User>(UserStoreGetters.USER);
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

  private get lastOpenDocumentKey(): string | undefined {
    return documentStore.getters(DocumentStoreGetters.SAVED_DOCUMENT_KEY);
  }

  private get libraryRoute(): Location {
    return {
      name: ROUTE_NAMES.library
    }
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

  private showOpenDocumentModal() {
    const event: ModalUpdateEvent<unknown> = {
      name: MODAL_UPDATE_EVENT_NAME,
      payload: {
        component: OPEN_DOCUMENT_COMPONENT_TAG,
        visible: true,
      },
    };
    emitter.$emit(MODAL_UPDATE_EVENT_NAME, event);
  }

  private openLastDocument() {
    const key = this.lastOpenDocumentKey;
    if (key) {
      LocalForageHelper.load(key).then((document) => {
        DocumentStoreHelper.resetDocumentStore();
        documentStore.commit(DocumentStoreMutations.SET_DOCUMENT, document);
        this.$router.push({ name: ROUTE_NAMES.edit });
      });
    }
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

<template src="@/views/home/home.template.html" />
<style src="@/views/home/home.style.scss" lang="scss" scoped />