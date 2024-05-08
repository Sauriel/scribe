import { SettingName } from "@/models/setting";

const BASE_FOLDER = "/images/document/backgrounds/masks/";

export interface SettingMask {
  id: string;
  src: string;
}

export interface SettingsWithMask {
  name: SettingName;
  masks: SettingMask[];
}

function findMasks(setting: SettingName, imageCount: number): SettingsWithMask {
  const backgrounds: SettingsWithMask = {
    name: setting,
    masks: [],
  };
  for (let i = 1; i <= imageCount; i++) {
    const background: SettingMask = {
      id: setting + "-" + i,
      src: BASE_FOLDER + setting + "/page_mask-" + setting + "-" + i + ".png",
    };
    backgrounds.masks.push(background);
  }
  return backgrounds;
}

export const MASKS: SettingsWithMask[] = [
  findMasks(SettingName.DEFAULT, 1),
  findMasks(SettingName.DUNGEONS_AND_DRAGONS, 5),
];
