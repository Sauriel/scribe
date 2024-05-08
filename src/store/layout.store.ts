import LayoutElement from "@/models/layout-elements/LayoutElement";
import { Module } from "vuex";

export interface IState {
  draggingElement?: LayoutElement;
  editingElement?: LayoutElement;
}

export const layoutStore: Module<IState, any> = {
  namespaced: true,
  state: {
    draggingElement: undefined,
    editingElement: undefined
  },
  getters: {
    draggingElement: state => state.draggingElement,
    editingElement: state => state.editingElement
  },
  mutations: {
    setDraggingElement(state: IState, value?: LayoutElement) {
      state.draggingElement = value;
    },
    setEditingElement(state: IState, value?: LayoutElement) {
      state.editingElement = value;
    }
  }
}