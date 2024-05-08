import store from "@/store/index";

export default class VuexHelper {
  public static createNamespace<S = any>(namespace: string) {
    const path = namespace.replace(/\//, ".");

    const state = VuexHelper.getProperty(store.state, path, null) as S;

    const commit = <T>(name: string, payload?: T) => {
      store.commit(`${namespace}/${name}`, payload);
    };

    const dispatch = <T>(name: string, payload?: T): Promise<any> => {
      return store.dispatch(`${namespace}/${name}`, payload);
    };

    const getters = <T>(getterName: string): any => {
      return store.getters[`${namespace}/${getterName}`];
    };

    return { state, commit, dispatch, getters };
  }

  private static getProperty(object: any, path: string, defaultValue: any = null) {
    return path.split(".").reduce((a, b) => (a && a[b] ? a[b] : defaultValue || null), object);
  }
}
