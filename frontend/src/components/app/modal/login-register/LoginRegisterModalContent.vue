<script lang="ts">
import { Vue, Options } from "vue-property-decorator";
import { SelectBarEntry } from "@/components/app/ui/select-bar/SelectBar.vue";
import Login from "@/components/app/modal/login-register/login/Login.vue"
import Register from "@/components/app/modal/login-register/register/Register.vue"

enum FormMode {
  LOGIN = "LOGIN",
  REGISTER = "REGISTER"
}

@Options({
  emits: ["close"],
  components: { Login, Register }
})
export default class LoginRegisterModalContent extends Vue {

  private isRegister = false; // or login

  private get mode(): FormMode {
    return this.isRegister ? FormMode.REGISTER : FormMode.LOGIN;
  }

  private set mode(mode: FormMode) {
    this.isRegister = mode == FormMode.REGISTER;
  }

  private get modes(): SelectBarEntry<FormMode>[] {
    return [
      {
        name: this.$t("login-register.mode.login"),
        data: FormMode.LOGIN
      },
      {
        name: this.$t("login-register.mode.register"),
        data: FormMode.REGISTER
      }
    ];
  }
}
</script>

<template src="@/components/app/modal/login-register/login-register.template.html" />
<style src="@/components/app/modal/login-register/login-register.style.scss" lang="scss" scoped />
