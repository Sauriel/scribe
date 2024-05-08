import mitt, { Emitter, Handler } from "mitt";
import localeChanged, { LOCALE_CHANGED_EVENT_NAME } from "@/events/locale";

const emitter: Emitter<any> = mitt<any>();

export default {
  $on: (event: string, handler: Handler<any>) => emitter.on(event, handler),
  $off: (event: string, handler: Handler<any>) => emitter.off(event, handler),
  $emit: (event: string, payload: any) => emitter.emit(event, payload),
  $lateEmit: (event: string, payload: any) => {
    setTimeout(() => emitter.emit(event, payload), 100);
  },
};

export interface EmitterEvent<T> {
  name: string;
  payload: T;
}

// Global Event Handler
emitter.on(LOCALE_CHANGED_EVENT_NAME, localeChanged);
