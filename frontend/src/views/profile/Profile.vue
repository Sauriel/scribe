<script lang="ts">
import { User } from "@/graphql/user/models";
import VuexHelper from "@/helper/VuexHelper";
import { UserStoreGetters } from "@/store/user/userStoreGetters";
import { USER_STORE_NAMESPACE } from "@/store/user/userStoreModule";
import { Vue, Options } from "vue-class-component";
import {
  PatreonInformationQuery,
  ChangeUserNameMutation,
  ChangeUserEmailMutation,
  ChangeUserPasswordMutation
  } from "@/graphql/user/models";
import patreonInformationSchema from "@/graphql/user/patreonInformation.gql";
import changeUserNameSchema from "@/graphql/user/changeUserName.gql";
import changeUserEmailSchema from "@/graphql/user/changeUserEmail.gql";
import changeUserPasswordSchema from "@/graphql/user/changeUserPassword.gql";
import ApolloService, { APOLLO_SERVICE } from "@/services/ApolloService";
import emitter from "@/emitter";
import { NotificationUpdateEvent, NOTIFICATION_UPDATE_EVENT_NAME } from "@/events/notification";
import { UserStoreActions } from "@/store/user/userStoreActions";
import EditablePassword from "./components/editable-password/EditablePassword.vue";
import EncryptionHelper from "@/helper/EncryptionHelper";

const userStore = VuexHelper.createNamespace(USER_STORE_NAMESPACE);
export const LINK_TO_PATREON_BROADCAST_CHANNEL_NAME = "link-to-patreon";

export enum PatreonBroadcastMessage {
  LINK_SUCCESS = "LINK_SUCCESS",
  CLOSE_TAB = "CLOSE_TAB"
};

@Options({
  components: { EditablePassword },
  inject: [ APOLLO_SERVICE ]
})
export default class Profile extends Vue {

  private get apollo(): ApolloService {
    // @ts-ignore
    return this.apolloService;
  }

  private get user(): User {
    return userStore.getters<User>(UserStoreGetters.USER) as User;
  }

  private set user(value: User) {
    userStore.dispatch(UserStoreActions.USER, value);
  }

  private get isPatreon(): boolean {
    return !!this.user.patreon;
  }

  private linkPatreon() {
    const patreonBroadcaster = new BroadcastChannel(LINK_TO_PATREON_BROADCAST_CHANNEL_NAME);
    const patreonUrl = new URL("https://www.patreon.com/oauth2/authorize");
    patreonUrl.searchParams.set("response_type", "code");
    patreonUrl.searchParams.set("client_id", import.meta.env.VITE_PATREON_CLIENT_ID);
    patreonUrl.searchParams.set("redirect_uri", import.meta.env.VITE_PATREON_REDIRECT_URL);
    patreonUrl.searchParams.set("scope", "identity identity[email]");
    patreonUrl.searchParams.set("state", this.user.id);
    window.open(patreonUrl.href);
    patreonBroadcaster.onmessage = (event: MessageEvent<PatreonBroadcastMessage>) => {
      if (event.data === PatreonBroadcastMessage.LINK_SUCCESS) {
        this.apollo
          .query<PatreonInformationQuery>(patreonInformationSchema)
          .then(data => {
            const user = this.user;
            user.patreon = data.patreonInformation;
            this.user = user;
          })
          .catch(e => {
            const firstError = e[0] || null;
            let messageKey = firstError?.extensions?.messageKey || "error.unknown";
            const event: NotificationUpdateEvent = {
              name: NOTIFICATION_UPDATE_EVENT_NAME,
              payload: {
                type: "failure",
                content: this.$t(messageKey),
                visible: true,
              },
            };
            emitter.$emit(NOTIFICATION_UPDATE_EVENT_NAME, event);
          });
        patreonBroadcaster.postMessage(PatreonBroadcastMessage.CLOSE_TAB);
      }
    };
  }

  private onUserNameChanged(newUserName: string) {
    this.apollo
      .mutation<ChangeUserNameMutation>(changeUserNameSchema, { username: newUserName }, true)
      .then(data => {
        if (data.changeUserName) {
          const user = this.user;
          user.username = newUserName;
          const event: NotificationUpdateEvent = {
            name: NOTIFICATION_UPDATE_EVENT_NAME,
            payload: {
              type: "success",
              content: this.$t("profile.table.name.changed.successfully"),
              visible: true,
            },
          };
          emitter.$emit(NOTIFICATION_UPDATE_EVENT_NAME, event);
        }
      })
      .catch(e => {
        const firstError = e[0] || null;
        let messageKey = firstError?.extensions?.messageKey || "error.unknown";
        const event: NotificationUpdateEvent = {
          name: NOTIFICATION_UPDATE_EVENT_NAME,
          payload: {
            type: "failure",
            content: this.$t(messageKey),
            visible: true,
          },
        };
        emitter.$emit(NOTIFICATION_UPDATE_EVENT_NAME, event);
      });
  }

  private onUserEmailChanged(newEmail: string) {
    this.apollo
      .mutation<ChangeUserEmailMutation>(changeUserEmailSchema, { email: newEmail }, true)
      .then(data => {
        if (data.changeUserEmail) {
          const user = this.user;
          user.email = newEmail;
          const event: NotificationUpdateEvent = {
            name: NOTIFICATION_UPDATE_EVENT_NAME,
            payload: {
              type: "success",
              content: this.$t("profile.table.email.changed.successfully"),
              visible: true,
            },
          };
          emitter.$emit(NOTIFICATION_UPDATE_EVENT_NAME, event);
        }
      })
      .catch(e => {
        const firstError = e[0] || null;
        let messageKey = firstError?.extensions?.messageKey || "error.unknown";
        const event: NotificationUpdateEvent = {
          name: NOTIFICATION_UPDATE_EVENT_NAME,
          payload: {
            type: "failure",
            content: this.$t(messageKey),
            visible: true,
          },
        };
        emitter.$emit(NOTIFICATION_UPDATE_EVENT_NAME, event);
      });
  }

  private onUserPasswordChanged(newPassword: string) {
    const encryptedPassword = EncryptionHelper.hashString(newPassword);
    this.apollo
      .mutation<ChangeUserPasswordMutation>(changeUserPasswordSchema, { password: encryptedPassword }, true)
      .then(data => {
        if (data.changeUserPassword) {
          const event: NotificationUpdateEvent = {
            name: NOTIFICATION_UPDATE_EVENT_NAME,
            payload: {
              type: "success",
              content: this.$t("profile.table.password.changed.successfully"),
              visible: true,
            },
          };
          emitter.$emit(NOTIFICATION_UPDATE_EVENT_NAME, event);
        }
      })
      .catch(e => {
        const firstError = e[0] || null;
        let messageKey = firstError?.extensions?.messageKey || "error.unknown";
        const event: NotificationUpdateEvent = {
          name: NOTIFICATION_UPDATE_EVENT_NAME,
          payload: {
            type: "failure",
            content: this.$t(messageKey),
            visible: true,
          },
        };
        emitter.$emit(NOTIFICATION_UPDATE_EVENT_NAME, event);
      });
  }
}
</script>

<template src="@/views/profile/profile.template.html" />
<style src="@/views/profile/profile.style.scss" lang="scss" scoped />