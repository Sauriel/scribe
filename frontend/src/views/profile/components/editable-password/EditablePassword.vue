<script lang="ts">
import { Vue, Options } from "vue-property-decorator";
import useVuelidate from "@vuelidate/core";
import { required,  minLength } from "@vuelidate/validators";

@Options({
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
      sameAsPassword: (value: string, siblings: EditablePassword) => {
        return value == siblings.password;
      }
    }
  }
})
export default class EditablePassword extends Vue {
  v$ = useVuelidate();

  private password = "";
  private repeatedPassword = "";
  private editable = false;

  public get hasErrors(): boolean {
    // @ts-ignore
    const passwordError = !this.v$.password.$dirty || this.v$.password.$error;
    // @ts-ignore
    const repeatedPasswordError = !this.v$.repeatedPassword.$dirty || this.v$.repeatedPassword.$error;
    return passwordError || repeatedPasswordError;
  }

  private save() {
    this.$emit("save", this.password);
    this.editable = false;
  }

  private cancel() {
    this.password = "",
    this.repeatedPassword = "";
    this.editable = false;
  }
}
</script>

<template src="@/views/profile/components/editable-password/editable-password.template.html" />
<style src="@/views/profile/components/editable-password/editable-password.style.scss" lang="scss" scoped />