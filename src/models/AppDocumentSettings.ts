export declare type Unit = "mm" | "in";

export class Ruleset {
  constructor(
    readonly name: string,
    readonly shortName: string,
    readonly fonts: string[],
    readonly subRules: Ruleset[],
    readonly disabled: boolean
    ) {}
}

const PixelPerUnit = {
  Millimeter: (96 / 25.4),
  Inch: 96
}

export class PageFormat {
  constructor(readonly name: string, readonly height: number, readonly width: number, readonly unit: Unit, readonly pixelPerUnit: number) {}
}

export const PAGE_FORMATS = {
  DIN_A4: new PageFormat("DIN A4", 297, 210, "mm", PixelPerUnit.Millimeter),
  US_LETTER: new PageFormat("US Letter", 11, 8.5, "in", PixelPerUnit.Inch),
  DIN_A5_LANDSCAPE: new PageFormat("DIN A5 (landscape)", 148, 210, "mm", PixelPerUnit.Millimeter)
}

export default interface AppDocumentSettings {
  setting: Ruleset;
  pageSize: PageFormat;
}