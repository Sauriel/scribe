<script lang="ts">
import emitter from "@/emitter";
import { NotificationUpdateEvent, NOTIFICATION_UPDATE_EVENT_NAME } from "@/events/notification";
import { ConfirmEmailQuery } from "@/graphql/user/models";
import confirmEmailSchema from "@/graphql/user/confirmEmail.gql";
import ApolloService, { APOLLO_SERVICE } from "@/services/ApolloService";
import { Vue, Options } from "vue-class-component";
import Login from "@/components/app/modal/login-register/login/Login.vue"

@Options({
  inject: [ APOLLO_SERVICE ],
  components: { Login }
})
export default class Registration extends Vue {

  private get apollo(): ApolloService {
    // @ts-ignore
    return this.apolloService;
  }

  private email = "";
  
  mounted() {
    const registrationToken = this.$route.query.token;
    this.apollo
        .query<ConfirmEmailQuery>(confirmEmailSchema, { token: registrationToken })
        .then(data => {
          this.email = data.confirmEmail;
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

<template src="@/views/registration/registration.template.html" />
<style src="@/views/registration/registration.style.scss" lang="scss" scoped />