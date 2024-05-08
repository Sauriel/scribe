import Vue from 'vue'
import Vuex from 'vuex'
import { appStore } from "@/store/app.store"
import { layoutStore } from "@/store/layout.store"

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    appStore,
    layoutStore
  }
})
