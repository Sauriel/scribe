import Vue from "vue";
import AppPage from "@/models/AppPage";

export const EventBus = new Vue();

export enum EVENTS {
  SHOW_PAGE = "SHOW_PAGE"
}

export interface ShowPageEvent {
  id: number;
  scroll: boolean;
}