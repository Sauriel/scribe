import store, { VuexLocalStoreFallbacks } from "@/store/index";

export default class VuexHelper {
  public static createNamespace<S = any>(namespace: string) {
    const path = namespace.replace(/\//, ".");

    const state = VuexHelper.getProperty(store.state, path, null) as S;

    const commit = <T>(name: string, payload?: T) => {
      store.commit(`${namespace}/${name}`, payload);
      // @ts-ignore
      const localStore = VuexLocalStoreFallbacks[namespace];
      const localStorageKey = localStore ? localStore[name] : undefined;
      if (localStorageKey) {
        if (payload) {
          localStorage.setItem(localStorageKey, JSON.stringify(payload));
        } else {
          localStorage.removeItem(localStorageKey);
        }
      }
    };

    const dispatch = <T>(name: string, payload?: T): Promise<any> => {
      return store.dispatch(`${namespace}/${name}`, payload);
    };

    const getters = <T>(getterName: string): T | undefined => {
      const value = store.getters[`${namespace}/${getterName}`];
      // @ts-ignore
      const localStore = VuexLocalStoreFallbacks[namespace];
      const localStorageKey = localStore ? localStore[getterName] : undefined;
      if (value) {
        return value;
      } else if (localStorageKey) {
        const fromLS = localStorage.getItem(localStorageKey);
        return fromLS ? JSON.parse(fromLS) : undefined;
      } else {
        return undefined;
      }
    };

    return { state, commit, dispatch, getters };
  }

  private static getProperty(object: any, path: string, defaultValue: any = null) {
    return path.split(".").reduce((a, b) => (a && a[b] ? a[b] : defaultValue || null), object);
  }
}
