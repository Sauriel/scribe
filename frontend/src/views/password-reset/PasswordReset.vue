<script lang="ts">
import { Vue, Options } from "vue-property-decorator";
import useVuelidate from "@vuelidate/core";
import { required, minLength } from "@vuelidate/validators";
import ApolloService, { APOLLO_SERVICE } from "@/services/ApolloService";
import resetPasswordSchema from "@/graphql/user/resetPassword.gql";
import { ResetPasswordMutation } from "@/graphql/user/models";
import emitter from "@/emitter";
import { NotificationType, NotificationUpdateEvent, NOTIFICATION_UPDATE_EVENT_NAME } from "@/events/notification";
import EncryptionHelper from "@/helper/EncryptionHelper";

@Options({
  inject: [ APOLLO_SERVICE ],
  validations: {
    password: {
      required,
      minLength: minLength(8),
      complexity: (value: string) => {
        // one of each: lowercase, uppercase, number, special character. Also min. 8 chars
        const regEx = new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})');
        return regEx.test(value);
      }
    },
    repeatedPassword: {
      required,
      sameAsPassword: (value: string, siblings: PasswordReset) => {
        return value == siblings.password;
      }
    }
  }
})

export default class PasswordReset extends Vue {
  v$ = useVuelidate();

  private get apollo(): ApolloService {
    // @ts-ignore
    return this.apolloService;
  }

  private password = "";
  private repeatedPassword = "";
  private token = "";

  public get hasErrors(): boolean {
    // @ts-ignore
    const passwordError = !this.v$.password.$dirty || this.v$.password.$error;
    // @ts-ignore
    const repeatedPasswordError = !this.v$.repeatedPassword.$dirty || this.v$.repeatedPassword.$error;
    return passwordError || repeatedPasswordError;
  }
  
  mounted() {
    this.token = this.$route.query.token as string;
  }

  public changePassword() {
    const encryptedPassword = EncryptionHelper.hashString(this.password);
    this.apollo
      .mutation<ResetPasswordMutation>(resetPasswordSchema, { token: this.token, password: encryptedPassword }, true)
      .then(data => {
        if (data.resetPassword) {
          this.showMessage("password-reset.success", "success");
        } else {
          this.showMessage("password-reset.failure", "failure");
        }
      })
      .catch(e => {
        const firstError = e[0] || null;
        let messageKey = firstError?.extensions?.messageKey || "error.unknown";
        this.showMessage(messageKey, "failure");
      });
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
}
</script>

<template src="@/views/password-reset/password-reset.template.html" />
<style src="@/views/password-reset/password-reset.style.scss" lang="scss" scoped />