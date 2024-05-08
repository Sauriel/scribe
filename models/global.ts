const PRECISION = 2;

const rounded = (value: number) => Math.round(value * Math.pow(10, PRECISION)) / Math.pow(10, PRECISION);

type Unit = 'px' | 'mm' | 'cm' | 'in';

const UnitToPixelRatio: Record<Unit, number> = {
  'px': 1,
  'mm': 3.7795296006,
  'cm': 37.7952959762,
  'in': 96
}

const Helper = {
  toPixel: (value: number, unit: Unit) => rounded(value * UnitToPixelRatio[unit]),
  toUnit: (value: number, unit: Unit) => rounded(value / UnitToPixelRatio[unit]),
  rounded,
}

export {
  Unit,
  Helper
}