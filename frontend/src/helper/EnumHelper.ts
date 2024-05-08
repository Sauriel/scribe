declare type EnumClass<T> = { [s: string]: T } | ArrayLike<T>;

export default class EnumHelper {
  public static getByValue<T>(enumClass: EnumClass<T>, value: string): T | undefined {
    // @ts-ignore
    return Object.values(enumClass).find((e) => e == value);
  }

  public static getByValueWithFallback<T>(enumClass: EnumClass<T>, value: string, fallback: T): T {
    // @ts-ignore
    return this.getByValue<T>(enumClass, value) || fallback;
  }
}
