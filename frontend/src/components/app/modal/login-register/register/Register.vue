<script lang="ts">
import { Vue, Options } from "vue-property-decorator";
import useVuelidate from "@vuelidate/core";
import { required, email, minLength } from "@vuelidate/validators";
import ApolloService, { APOLLO_SERVICE } from "@/services/ApolloService";
import registerSchema from "@/graphql/user/createUser.gql";
import { CreateUserMutation } from "@/graphql/user/models";
import emitter from "@/emitter";
import { NotificationUpdateEvent, NOTIFICATION_UPDATE_EVENT_NAME } from "@/events/notification";
import EncryptionHelper from "@/helper/EncryptionHelper";

@Options({
  emits: ["success"],
  inject: [ APOLLO_SERVICE ],
  validations: {
    email: { required, email },
    userName: { required },
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
      sameAsPassword: (value: string, siblings: Register) => {
        return value == siblings.password;
      }
    }
  }
})
export default class Register extends Vue {
  v$ = useVuelidate();

  private get apollo(): ApolloService {
    // @ts-ignore
    return this.apolloService;
  }
  
  private email = "";
  private userName = "";
  private password = "";
  private repeatedPassword = "";

  public get hasErrors(): boolean {
    // @ts-ignore
    const userNameError = !this.v$.userName.$dirty || this.v$.userName.$error;
    // @ts-ignore
    const emailError = !this.v$.email.$dirty || this.v$.email.$error;
    // @ts-ignore
    const passwordError = !this.v$.password.$dirty || this.v$.password.$error;
    // @ts-ignore
    const repeatedPasswordError = !this.v$.repeatedPassword.$dirty || this.v$.repeatedPassword.$error;
    return userNameError || emailError || passwordError || repeatedPasswordError;
  }

  public register() {
    const encryptedPassword = EncryptionHelper.hashString(this.password);
    this.apollo
      .mutation<CreateUserMutation>(registerSchema, { username: this.userName, email: this.email, password: encryptedPassword }, true)
      .then(data => this.$emit("success"))
      .catch(e => {
        const firstError = e[0] || null;
        let messageKey = firstError?.extensions?.messageKey || "error.unknown";
        this.showErrorMessage(messageKey);
      });
  }

  private showErrorMessage(messageKey: string) {
    const event: NotificationUpdateEvent = {
      name: NOTIFICATION_UPDATE_EVENT_NAME,
      payload: {
        type: "failure",
        content: this.$t(messageKey),
        visible: true,
      },
    };
    emitter.$emit(NOTIFICATION_UPDATE_EVENT_NAME, event);
  }
}
</script>

<template src="@/components/app/modal/login-register/register/register.template.html" />
<style src="@/components/app/modal/login-register/register/register.style.scss" lang="scss" scoped />