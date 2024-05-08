<template>
  <div class="app" ref="app">
    <top-bar :id="topBarId" />
    <div :id="contentId" class="content">
      <router-view />
    </div>
    <modal />
    <small-dialog />
    <notification />
    <context-menu />
    <analytics-info />
  </div>
</template>

<script lang="ts">
import { Vue, Options, Ref, Watch } from "vue-property-decorator";
import TopBar from "@/components/app/global/top-bar/TopBar.vue";
import Modal from "@/components/app/ui/modal/Modal.vue";
import SmallDialog from "@/components/app/ui/small-dialog/SmallDialog.vue";
import Notification from "@/components/app/ui/notification/Notification.vue";
import ContextMenu from "@/components/app/ui/context-menu/ContextMenu.vue";
import AnalyticsInfo from "@/components/app/global/analytics/AnalyticsInfo.vue";
import ThemeVariables, { DEFAULT, THEMES } from "@/models/ThemeVariables";
import HistoryManager, { HISTORY_MANAGER } from "@/history/HistoryManager";
import VuexHelper from "@/helper/VuexHelper";
import ApolloService, { APOLLO_SERVICE } from "@/services/ApolloService";
import { GLOBAL_STORE_NAMESPACE } from "@/store/global/globalStoreModule";
import { GlobalStoreGetters } from "@/store/global/globalStoreGetters";
import { UserStoreGetters } from "@/store/user/userStoreGetters";
import { USER_STORE_NAMESPACE } from "@/store/user/userStoreModule";
import { PersistedUserInformation } from "@/models/user";
import { UserActionPayload, UserStoreActions } from "@/store/user/userStoreActions";
import softLoginSchema from "@/graphql/user/softLogin.gql";
import { SoftLoginQuery, User } from "@/graphql/user/models";
import isAfter from "date-fns/isAfter";
import parseISO from "date-fns/parseISO";
import { CHANGELOG_COMPONENT_TAG, ModalUpdateEvent, MODAL_UPDATE_EVENT_NAME } from "./events/modal";
import emitter from "./emitter";

const globalStore = VuexHelper.createNamespace(GLOBAL_STORE_NAMESPACE);
const userStore = VuexHelper.createNamespace(USER_STORE_NAMESPACE);

export const TOP_BAR_ID = "top-bar";
export const CONTENT_ID = "content";
export const BLURRED_CLASS = "blurred";

@Options({
  components: {
    TopBar,
    Modal,
    SmallDialog,
    Notification,
    ContextMenu,
    AnalyticsInfo,
  },
  inject: [ HISTORY_MANAGER, APOLLO_SERVICE ],
})
export default class App extends Vue {
  @Ref()
  private readonly app!: HTMLDivElement;

  private get topBarId(): string {
    return TOP_BAR_ID;
  }

  private get contentId(): string {
    return CONTENT_ID;
  }

  private get history(): HistoryManager {
    // @ts-ignore
    return this.historyManager;
  }

  private get apollo(): ApolloService {
    // @ts-ignore
    return this.apolloService;
  }

  private get appVersion(): string {
    return import.meta.env.PACKAGE_VERSION ;
  }

  mounted() {
    this.handleSoftLogin();
    document.addEventListener("keyup", this.keyupHandler);
    document.addEventListener("keydown", this.keydownHandler);
    this.setThemeVariables();

    const lastSeenChangelog = globalStore.getters<string>(GlobalStoreGetters.CHANGELOG_LAST_SEEN);
    if (lastSeenChangelog !== this.appVersion) {
      this.showChangelog();
    }
    
  }

  destroyed() {
    document.removeEventListener("keyup", this.keyupHandler);
    document.removeEventListener("keydown", this.keydownHandler);
  }
  private zPressed = false; // Fix for Mac OS, because CMD+Z is catched by the browser
  private yPressed = false;

  private keydownHandler(event: KeyboardEvent) {
    const ctrlOrCmd = event.ctrlKey || event.metaKey;
    if (ctrlOrCmd && event.key === "z") {
      this.zPressed = true;
    }
    if (ctrlOrCmd && event.key === "y") {
      this.yPressed = true;
    }
  }

  private keyupHandler(event: KeyboardEvent) {
    event.stopImmediatePropagation();
    const ctrlOrCmd = event.ctrlKey || event.metaKey;
    if (ctrlOrCmd && event.key === "z") {
      this.history.undo();
    } else if (ctrlOrCmd && event.key === "y") {
      this.history.redo();
    } else if (event.key === "Meta") {
      // Fix for Mac OS
      if (this.zPressed) {
        this.history.undo();
      } else if (this.yPressed) {
        this.history.redo();
      }
    }
    this.zPressed = false;
    this.yPressed = false;
  }

  @Watch("theme")
  private onThemeChange() {
    this.setThemeVariables();
  }

  private get theme(): string {
    return globalStore.getters(GlobalStoreGetters.THEME) || DEFAULT.name;
  }

  private setThemeVariables() {
    if (this.app) {
      if (this.theme && this.theme !== DEFAULT.name) {
      const theme =
          THEMES.find((theme) => theme.name === globalStore.getters(GlobalStoreGetters.THEME)) ||
          DEFAULT;
        this.app.style.setProperty("--color-background", theme.background);
        this.app.style.setProperty("--color-background--light", theme.backgroundLight);
        this.app.style.setProperty("--color-background--dark", theme.backgroundDark);

        this.app.style.setProperty("--color-foreground", theme.foreground);
        this.app.style.setProperty("--color-foreground--light", theme.foregroundLight);
        this.app.style.setProperty("--color-foreground--dark", theme.foregroundDark);

        this.app.style.setProperty("--color-primary", theme.primary);
        this.app.style.setProperty("--color-primary--light", theme.primaryLight);
        this.app.style.setProperty("--color-primary--dark", theme.primaryDark);

        this.app.style.setProperty("--color-secondary", theme.secondary);
        this.app.style.setProperty("--color-secondary--light", theme.secondaryLight);
        this.app.style.setProperty("--color-secondary--dark", theme.secondaryDark);

        this.app.style.setProperty("--color-alert", theme.alert);
        this.app.style.setProperty("--color-alert--light", theme.alertLight);
        this.app.style.setProperty("--color-alert--dark", theme.alertDark);

        this.app.style.setProperty("--color-warning", theme.warning);
        this.app.style.setProperty("--color-success", theme.success);

        this.app.style.setProperty("--color-app-background", theme.appBackground);

        this.app.style.setProperty("--border-radius", theme.borderRadius + "px");
      } else {
        this.app.style.removeProperty("--color-background");
        this.app.style.removeProperty("--color-background--light");
        this.app.style.removeProperty("--color-background--dark");

        this.app.style.removeProperty("--color-foreground");
        this.app.style.removeProperty("--color-foreground--light");
        this.app.style.removeProperty("--color-foreground--dark");

        this.app.style.removeProperty("--color-primary");
        this.app.style.removeProperty("--color-primary--light");
        this.app.style.removeProperty("--color-primary--dark");

        this.app.style.removeProperty("--color-secondary");
        this.app.style.removeProperty("--color-secondary--light");
        this.app.style.removeProperty("--color-secondary--dark");

        this.app.style.removeProperty("--color-alert");
        this.app.style.removeProperty("--color-alert--light");
        this.app.style.removeProperty("--color-alert--dark");

        this.app.style.removeProperty("--color-warning");
        this.app.style.removeProperty("--color-success");

        this.app.style.removeProperty("--color-app-background");

        this.app.style.removeProperty("--border-radius");
      }
    }
  }

  private handleSoftLogin() {
    const user = userStore.getters<User>(UserStoreGetters.USER);
    if (!user) {
      const persistedUser = userStore.getters<PersistedUserInformation>(UserStoreGetters.PERSISTED_USER);
      if (persistedUser) {
        if(isAfter(new Date(), parseISO(persistedUser.refreshTokenExpireDate))) {
          userStore.dispatch(UserStoreActions.USER, undefined);
        } else {
          this.apollo
            .query<SoftLoginQuery>(softLoginSchema, { userId: persistedUser.id, refreshToken: persistedUser.refreshToken }, true)
            .then(data => {
              const user: UserActionPayload = { user: data.softLogin, keepLoggedIn: true };
              userStore.dispatch(UserStoreActions.USER, user);
            })
            .catch(e => {
              userStore.dispatch(UserStoreActions.USER, undefined);
              console.error("Soft login was not possible", e);
            });
        }
      }
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

<style lang="scss">
@import "@/styles/basic.module.scss";

#app {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  @media print {
    overflow: initial;
  }

  button, input {
    font-family: "Fira Sans", sans-serif;
  }

  .app {
    background-color: var(--color-background);
    color: var(--color-foreground);
    font-family: "Fira Sans", sans-serif;

    .top-bar {
      flex: 0 0 auto;

      @media print {
        display: none;
      }
    }

    .content {
      display: flex;
      height: calc(100vh - 50px);
      background-color: var(--color-app-background);

      @media print {
        height: auto;
      }
    }

    .blurred {
      filter: blur(4px);
    }

    *::-webkit-scrollbar-track {
      -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
      background-color: transparent;
    }

    *::-webkit-scrollbar {
      width: 10px;
      height: 10px;
      background-color: var(--color-background--light);
    }

    *::-webkit-scrollbar-thumb {
      background-color: var(--color-foreground);
    }
  }
}

th {
  font-weight: initial;
  text-align: initial;
}

.alert {
  color: var(--color-alert);
}
</style>
