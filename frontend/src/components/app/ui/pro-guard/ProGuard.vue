<script lang="ts">
import { Vue } from "vue-property-decorator";
import VuexHelper from "@/helper/VuexHelper";
import { USER_STORE_NAMESPACE } from "@/store/user/userStoreModule";
import { UserStoreGetters } from "@/store/user/userStoreGetters";
import RightsHelper from "@/helper/RightsHelper";
import { User } from "@/graphql/user/models";

const userStore = VuexHelper.createNamespace(USER_STORE_NAMESPACE);

declare type SlotFunction = (...args: unknown[]) => void;

export default class ProGuard extends Vue {

  private get user(): User | undefined {
    return userStore.getters<User>(UserStoreGetters.USER);
  }

  private get isAllowed(): boolean {
    return RightsHelper.isProMember(this.user);
  }

  private secureCall(slotFunction: SlotFunction): SlotFunction {
    if (this.isAllowed) {
      return slotFunction;
    } else {
      return (...args: unknown[]) => {
        console.error("User has no right to call this function!");
      };
    }
  }
}
</script>

<template src="@/components/app/ui/pro-guard/pro-guard.template.html" />
<style src="@/components/app/ui/pro-guard/pro-guard.style.scss" lang="scss" scoped />