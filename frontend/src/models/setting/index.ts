import DesignBlock, { BASE_BLOCKS, DEFAULT_BLOCKS, DND_BLOCKS } from "@/models/setting/elements";
import { NamedColor } from "@/models";
import defaultSettingImage from "@/assets/images/settings/default.png";
import dndSettingImage from "@/assets/images/settings/dnd.png";

export enum SettingName {
  BASE = "base",
  DEFAULT = "default",
  DUNGEONS_AND_DRAGONS = "dandd",
}

export class Setting {
  constructor(
    public name: SettingName,
    public image: string,
    public blocks: DesignBlock[],
    public fonts: string[] = [],
    public colors: NamedColor[] = []
  ) {}
}

export const BASE_SETTING = new Setting(SettingName.BASE, "", BASE_BLOCKS);

export const SETTINGS = {
  // DEFAULT: new Setting(
  //   SettingName.DEFAULT,
  //   defaultSettingImage,
  //   DEFAULT_BLOCKS
  // ),
  DUNGEONS_AND_DRAGONS: new Setting(
    SettingName.DUNGEONS_AND_DRAGONS,
    dndSettingImage,
    DND_BLOCKS,
    [
      "Book Insanity",
      "Dungeon Drop Case",
      "Mr Eaves Small Caps",
      "Nodesto Caps Condensed",
      "Scaly Sans",
      "Scaly Sans Remake",
      "Scaly Sans Caps",
      "Solbera Imitation",
      "Zatanna Misdirection",
    ],
    [
      {
        name: "PHB Black",
        value: "#1d1d1b",
      },
      {
        name: "PHB Dark Red",
        value: "#58180d",
      },
      {
        name: "PHB Gold",
        value: "#c9ad6a",
      },
      {
        name: "PHB Light Gray",
        value: "#d6d8cf",
      },
      {
        name: "PHB Intro Fawn",
        value: "#fcf8ed",
      },
      {
        name: "PHB Character Green",
        value: "#e0e5c1",
      },
      {
        name: "PHB Game Blue",
        value: "#d2ead4",
      },
      {
        name: "PHB Magic Lilac",
        value: "#e8e1e7",
      },
      {
        name: "PHB Appendix Brown",
        value: "#efe3c0",
      },
    ]
  ),
};
