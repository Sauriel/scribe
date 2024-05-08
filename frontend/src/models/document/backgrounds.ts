import { SettingName } from "@/models/setting";

const BASE_FOLDER = "/images/document/backgrounds/";

export interface SelectedBackground {
  page: number;
  index: number;
}

export interface SettingBackground {
  id: string;
  src: string;
  thumb: string;
}

export interface SettingsWithBackgrounds {
  name: SettingName;
  backgrounds: SettingBackground[];
}

function findBackgrounds(setting: SettingName, imageCount: number): SettingsWithBackgrounds {
  const backgrounds: SettingsWithBackgrounds = {
    name: setting,
    backgrounds: [],
  };
  for (let i = 1; i <= imageCount; i++) {
    const background: SettingBackground = {
      id: setting + "-" + i,
      src: BASE_FOLDER + setting + "/page_bg-" + setting + "-" + i + ".jpg",
      thumb: BASE_FOLDER + setting + "/page_bg-" + setting + "-" + i + "_thumb.jpg",
    };
    backgrounds.backgrounds.push(background);
  }
  return backgrounds;
}

export const DEFAULT_BACKGROUNDS: SettingsWithBackgrounds = findBackgrounds(SettingName.DEFAULT, 3);
export const DUNGEONS_AND_DRAGONS_BACKGROUNDS: SettingsWithBackgrounds = findBackgrounds(
  SettingName.DUNGEONS_AND_DRAGONS,
  3
);

export const BACKGROUNDS: SettingsWithBackgrounds[] = [
  DEFAULT_BACKGROUNDS,
  DUNGEONS_AND_DRAGONS_BACKGROUNDS,
];
