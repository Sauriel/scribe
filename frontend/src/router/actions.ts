import { UserStoreGetters } from "./../store/user/userStoreGetters";
import { USER_STORE_NAMESPACE } from "./../store/user/userStoreModule";
import { DocumentStoreGetters } from "@/store/document/documentStoreGetters";
import { DOCUMENT_STORE_NAMESPACE } from "@/store/document/documentStoreModule";
import { RouteLocationNormalized, NavigationGuardNext } from "vue-router";
import i18n, { translate } from "@/i18n";
import VuexHelper from "@/helper/VuexHelper";
import { GLOBAL_STORE_NAMESPACE } from "@/store/global/globalStoreModule";
import { GlobalStoreGetters } from "@/store/global/globalStoreGetters";
import { AppLocale } from "@/store/global/globalStoreState";
import { LocaleChangedEvent, LOCALE_CHANGED_EVENT_NAME } from "@/events/locale";
import emitter from "@/emitter";
import { ROUTE_NAMES } from "@/router/";
import ApolloService, { APOLLO_SERVICE, apolloService } from "@/services/ApolloService";
import { DocFindQuery } from "@/graphql/document/models";
import docFindSchema from "@/graphql/document/doc_find.gql";
import DocumentModel from "@/models/document";

export interface RouteTitle {
  messageKey: string;
  variables?: Record<string, any>;
}

const userStore = VuexHelper.createNamespace(USER_STORE_NAMESPACE);
const globalStore = VuexHelper.createNamespace(GLOBAL_STORE_NAMESPACE);
const documentStore = VuexHelper.createNamespace(DOCUMENT_STORE_NAMESPACE);

function setLocale() {
  /* ToDo: ToDo: Uncomment if localizations are added
  const localeFromStore = globalStore.getters(GlobalStoreGetters.LOCALE);
  const localeFromBrowser = navigator.language || (navigator as any).userLanguage;
  let locale: string;
  if (localeFromStore) {
    locale = localeFromStore;
  } else if (localeFromBrowser) {
    const dashIndex = localeFromBrowser.indexOf("-");
    if (dashIndex > 0) {
      locale = localeFromBrowser.substring(0, dashIndex);
    } else {
      locale = localeFromBrowser;
    }
  } else {
    locale = i18n.global.fallbackLocale.toString();
  }
  */
  const locale = "en"; // ToDo: ToDo: Remove when localizations are added
  const event: LocaleChangedEvent = {
    name: LOCALE_CHANGED_EVENT_NAME,
    payload: locale as AppLocale,
  };
  emitter.$emit(LOCALE_CHANGED_EVENT_NAME, event);
}

function setDocumentTitle(to: RouteLocationNormalized) {
  const title: RouteTitle | undefined = to.meta.title as RouteTitle;
  const appName = translate("global.app.name");
  const appVersion = translate("global.app.version.normal");
  let route;
  if (title) {
    route = translate(title.messageKey, title.variables);
  } else {
    route = translate("global.app.slogan");
  }
  document.title = translate("global.routes.default", { appName, appVersion, route });
}

function checkRights(to: RouteLocationNormalized, next: NavigationGuardNext) {
  if (to.meta.onlyAuthenticated) {
    if (!userStore.getters<boolean>(UserStoreGetters.IS_LOGGED_IN)) {
      next({ name: ROUTE_NAMES.home })
    }
  }
}

export function beforeEachRouteAction(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  checkRights(to, next);
  setLocale();
  setDocumentTitle(to);
  next();
}

export function checkForDocument(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  const document = documentStore.getters(DocumentStoreGetters.DOCUMENT);
  if (document) {
    next();
  } else {
    next({ name: ROUTE_NAMES.home });
  }
}

export function fetchViewDocument(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
      if (!to.query.id) {
        next({ name: ROUTE_NAMES.library })
      }
      apolloService
        .query<DocFindQuery>(docFindSchema, { id: to.query.id }, true)
        .then(data => {
          const documentModel: DocumentModel = {
            version: data.doc_find.version,
            name: data.doc_find.name,
            format: data.doc_find.format,
            pages: data.doc_find.pages,
            defaults: data.doc_find.defaults
          };
          const appName = translate("global.app.name");
          const appVersion = translate("global.app.version.normal");
          const route = translate("global.routes.view", { document: documentModel.name, author: data.doc_find.user.username });
          document.title = translate("global.routes.default", { appName, appVersion, route });
          to.meta.document = documentModel;
          to.meta.author = data.doc_find.user.username;
          next();
        })
        .catch(e => {
          console.error(e);
          next({ name: ROUTE_NAMES.library })
        });
}
