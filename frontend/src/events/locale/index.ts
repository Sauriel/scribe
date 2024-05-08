import i18n from "@/i18n";
import { EmitterEvent } from "@/emitter";
import { AppLocale } from "@/store/global/globalStoreState";
import VuexHelper from "@/helper/VuexHelper";
import { GLOBAL_STORE_NAMESPACE } from "@/store/global/globalStoreModule";
import { GlobalStoreMutations } from "@/store/global/globalStoreMutations";

const globalStore = VuexHelper.createNamespace(GLOBAL_STORE_NAMESPACE);

export const LOCALE_CHANGED_EVENT_NAME = "locale:changed";
export interface LocaleChangedEvent extends EmitterEvent<AppLocale> {}

export default function localeChanged(event: LocaleChangedEvent) {
  globalStore.commit(GlobalStoreMutations.SET_LOCALE, event.payload);
  i18n.global.locale.value = event.payload;
}
