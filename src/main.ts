import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
//@ts-ignore
import VueWaypoint from 'vue-waypoint';
import VueDragDrop from 'vue-drag-drop';
import VModal from 'vue-js-modal'
import Fragment from 'vue-fragment';
import "@/eventBus";
import "@/AppMessenger";
import "@/fontAwesomeIcons";
import "@/chaches";

import VueSlider from 'vue-slider-component';
import 'vue-slider-component/theme/default.css';
import 'vue-simple-context-menu/dist/vue-simple-context-menu.css';
//@ts-ignore
import VueSimpleContextMenu from 'vue-simple-context-menu';
import VerticalLayout from '@/components/layout-elements/VerticalLayout.vue';
import SpacerElementLayout from '@/components/layout-elements/SpacerElementLayout.vue';
import SpacerElementLayoutSettings from '@/components/layout-elements/settings/SpacerElementLayoutSettings.vue';
import HeadingElementLayout from '@/components/layout-elements/HeadingElementLayout.vue';
import HeadingElementLayoutSettings from '@/components/layout-elements/settings/HeadingElementLayoutSettings.vue';
import ParagraphElementLayout from '@/components/layout-elements/ParagraphElementLayout.vue';
import ParagraphElementLayoutSettings from '@/components/layout-elements/settings/ParagraphElementLayoutSettings.vue';
import HorizontalLayout from '@/components/layout-elements/HorizontalLayout.vue';
import HorizontalLayoutSettings from '@/components/layout-elements/settings/HorizontalLayoutSettings.vue';
import NoteElementLayout from '@/components/layout-elements/NoteElementLayout.vue';
import NoteElementLayoutSettings from '@/components/layout-elements/settings/NoteElementLayoutSettings.vue';
import TableElementLayout from '@/components/layout-elements/TableElementLayout.vue';
import TableElementLayoutSettings from '@/components/layout-elements/settings/TableElementLayoutSettings.vue';
import MonsterBlockLayout from '@/components/layout-elements/MonsterBlockLayout.vue';
import MonsterBlockLayoutSettings from '@/components/layout-elements/settings/MonsterBlockLayoutSettings.vue';
import ElementSettingsDisabledNote from "@/components/tools/settings/ElementSettingsDisabledNote.vue";
import Icon from "@/components/ui/Icon.vue";
import TextInput from "@/components/ui/TextInput.vue";
import Btn from "@/components/ui/Btn.vue";

Vue.component('VueSlider', VueSlider);
Vue.component('vue-simple-context-menu', VueSimpleContextMenu)
Vue.component("VerticalLayout", VerticalLayout);
Vue.component("HorizontalLayout", HorizontalLayout);
Vue.component("HorizontalLayoutSettings", HorizontalLayoutSettings);
Vue.component("SpacerElementLayout", SpacerElementLayout);
Vue.component("SpacerElementLayoutSettings", SpacerElementLayoutSettings);
Vue.component("HeadingElementLayout", HeadingElementLayout);
Vue.component("HeadingElementLayoutSettings", HeadingElementLayoutSettings);
Vue.component("ParagraphElementLayout", ParagraphElementLayout);
Vue.component("ParagraphElementLayoutSettings", ParagraphElementLayoutSettings);
Vue.component("NoteElementLayout", NoteElementLayout);
Vue.component("NoteElementLayoutSettings", NoteElementLayoutSettings);
Vue.component("TableElementLayout", TableElementLayout);
Vue.component("TableElementLayoutSettings", TableElementLayoutSettings);
Vue.component("MonsterBlockLayout", MonsterBlockLayout);
Vue.component("MonsterBlockLayoutSettings", MonsterBlockLayoutSettings);
Vue.component("ElementSettingsDisabledNote", ElementSettingsDisabledNote);
Vue.component("Icon", Icon);
Vue.component("TextInput", TextInput);
Vue.component("Btn", Btn);

Vue.config.productionTip = false;
Vue.use(VueWaypoint);
Vue.use(VueDragDrop);
Vue.use(VModal);
Vue.use(Fragment.Plugin);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
