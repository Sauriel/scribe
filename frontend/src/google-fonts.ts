import {
  FontManagerConfig,
  GoogleFontManager,
} from "@/components/app/ui/font-selector/GoogleFontManager";
import { Font, FontList } from "@samuelmeuli/font-manager";

class GoogleFontManagerCache {
  public readonly manager!: GoogleFontManager;
  public fontList: FontList = new Map<string, Font>();

  constructor(config: FontManagerConfig) {
    this.manager = new GoogleFontManager(config);
    this.manager
      .initManager()
      .then((list: FontList) => (this.fontList = list))
      .catch((reason: any) => console.error(reason));
  }
}

export const GOOGLE_FONTS_CACHE = new GoogleFontManagerCache({
  apiKey: import.meta.env.VITE_GFONTS_API_KEY,
  options: {
    limit: 50,
    scripts: ["latin", "latin-ext"],
    sort: "popularity",
  },
});
