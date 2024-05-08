import { Font, FontList, FontManager, Options, OPTIONS_DEFAULTS } from "@samuelmeuli/font-manager";

export type FontManagerOptions = Partial<Options>;
export type OnFontChangeFn = (font: Font) => void;

export interface FontManagerAndList {
  manager: GoogleFontManager;
  list: FontList;
}

export interface FontManagerConfig {
  apiKey: string;
  options: FontManagerOptions;
  defaultFamily?: string;
  onChange?: OnFontChangeFn;
}

export class GoogleFontManager {
  private manager: FontManager;

  public constructor(config: FontManagerConfig) {
    const options: Options = {
      ...OPTIONS_DEFAULTS,
      ...config.options,
    };
    this.manager = new FontManager(config.apiKey, config.defaultFamily, options, config.onChange);
  }

  public initManager(): Promise<FontList> {
    return this.manager.init();
  }

  public getActiveFont(): Font {
    return this.manager.getActiveFont();
  }

  public setActiveFont(family: string, triggerChange = false) {
    this.manager.setActiveFont(family, triggerChange);
  }

  public addFont(family: string, loadPreview = false) {
    this.manager.addFont(family, loadPreview);
  }

  public removeFont(family: string) {
    this.manager.removeFont(family);
  }

  public getFonts(): FontList {
    return this.manager.getFonts();
  }

  public static async init(config: FontManagerConfig): Promise<FontManagerAndList> {
    const manager = new GoogleFontManager(config);
    return manager
      .initManager()
      .then((list: FontList) => ({ manager: manager, list: list }))
      .catch((reason: any) => Promise.reject(reason));
  }
}
