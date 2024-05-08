<script lang="ts">
import { Vue, Options, Prop } from "vue-property-decorator";
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import ApolloService, { APOLLO_SERVICE } from "@/services/ApolloService";
import loginSchema from "@/graphql/user/login.gql";
import passwordForgottenSchema from "@/graphql/user/passwordForgotten.gql";
import { LoginQuery, PasswordForgottenMutation } from "@/graphql/user/models";
import VuexHelper from "@/helper/VuexHelper";
import { USER_STORE_NAMESPACE } from "@/store/user/userStoreModule";
import { UserActionPayload, UserStoreActions } from "@/store/user/userStoreActions";
import emitter from "@/emitter";
import { NotificationType, NotificationUpdateEvent, NOTIFICATION_UPDATE_EVENT_NAME } from "@/events/notification";
import EncryptionHelper from "@/helper/EncryptionHelper";

const userStore = VuexHelper.createNamespace(USER_STORE_NAMESPACE);

@Options({
  emits: ["success"],
  inject: [ APOLLO_SERVICE ],
  validations: {
    loginName: { required },
    loginPassword: { required }
  }
})
export default class Login extends Vue {
  v$ = useVuelidate();

  private get apollo(): ApolloService {
    // @ts-ignore
    return this.apolloService;
  }

  @Prop()
  private predefinedEmail?: string;

  mounted() {
    this.loginName = this.predefinedEmail || "";
    // @ts-ignore
    this.v$.loginName.$model = this.loginName;
  }

  private loginName = "";
  private loginPassword = "";
  private keepLoggedIn = false;

  private get hasLoginNameError(): boolean {
    // @ts-ignore
    return !this.v$.loginName.$dirty || this.v$.loginName.$error;
  }

  public get hasErrors(): boolean {
    // @ts-ignore
    const loginPasswordError = !this.v$.loginPassword.$dirty || this.v$.loginPassword.$error;
    return this.hasLoginNameError || loginPasswordError;
  }

  public login() {
    const encryptedPassword = EncryptionHelper.hashString(this.loginPassword);
    this.apollo
      .query<LoginQuery>(loginSchema, { loginName: this.loginName, password: encryptedPassword }, true)
      .then(data => {
        const payload: UserActionPayload = { user: data.login, keepLoggedIn: this.keepLoggedIn };
        userStore.dispatch(UserStoreActions.USER, payload);
        this.$emit("success");
      })
      .catch(e => {
        const firstError = e[0] || null;
        let messageKey = firstError?.extensions?.messageKey || "error.unknown";
        this.showErrorMessage(messageKey);
      });
  }

  private showErrorMessage(messageKey: string) {
    this.showMessage(messageKey, "failure");
  }

  private showMessage(messageKey: string, type: NotificationType) {
    const event: NotificationUpdateEvent = {
      name: NOTIFICATION_UPDATE_EVENT_NAME,
      payload: {
        type: type,
        content: this.$t(messageKey),
        visible: true,
      },
    };
    emitter.$emit(NOTIFICATION_UPDATE_EVENT_NAME, event);
  }


  private onPasswordForgottenClick() {
    this.apollo
      .mutation<PasswordForgottenMutation>(passwordForgottenSchema, { loginName: this.loginName }, true)
      .then(data => {
        if (data.passwordForgotten) {
          this.showMessage("login-register.login.passwordForgotten.success", "success");
        } else {
          this.showMessage("login-register.login.passwordForgotten.failure", "failure");
        }
      })
      .catch(e => {
        const firstError = e[0] || null;
        let messageKey = firstError?.extensions?.messageKey || "error.unknown";
        this.showErrorMessage(messageKey);
      });
  }
}
</script>

<template src="@/components/app/modal/login-register/login/login.template.html" />
<style src="@/components/app/modal/login-register/login/login.style.scss" lang="scss" scoped />