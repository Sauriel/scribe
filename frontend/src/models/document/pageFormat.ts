export declare type UnitSuffix = "mm" | "in" | "px";

export class Unit {
  constructor(readonly label: string, readonly suffix: UnitSuffix, readonly pixelPerUnit: number) {}
}

export class PageFormat {
  constructor(
    readonly label: string,
    public height: number,
    public width: number,
    public unit: Unit,
    readonly custom?: boolean
  ) {}
}

export const Units = {
  MILLIMETER: new Unit("document.unit.mm", "mm", 96 / 25.4),
  INCH: new Unit("document.unit.inch", "in", 96),
  PIXEL: new Unit("document.unit.pixel", "px", 1),
};

export const PAGE_FORMATS = {
  DIN_A4: new PageFormat("document.page.format.a4", 297, 210, Units.MILLIMETER),
  US_LETTER: new PageFormat("document.page.format.letter", 11, 8.5, Units.INCH),
  CUSTOM: new PageFormat("document.page.format.custom", 200, 200, Units.PIXEL, true),
};
