import mitt from 'mitt';
import type { ToastMessage } from '~~/models/components/toast';

declare type BusEvent = {
  'toast:show': ToastMessage;
};

const emitter = mitt<BusEvent>();

export default defineNuxtPlugin(() => {
  return {
    provide: {
      bus: {
        on: emitter.on,
        emit: emitter.emit,
      }
    }
  }
});