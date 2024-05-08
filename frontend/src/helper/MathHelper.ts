const GCD_PRECISION = 0.0000001;

export default class MathHelper {
  public static asFraction(value: number): string {
    if (!Number.isInteger(value)) {
      const length = value.toString().length - 2;
      let denominator = Math.pow(10, length);
      let numerator = value * denominator;
      const divisor = this.gcd(numerator, denominator);
      numerator /= divisor;
      denominator /= divisor;
      return Math.floor(numerator) + "/" + Math.floor(denominator);
    }
    return "" + value;
  }

  // Greatest Common Divisor
  public static gcd(a: number, b: number): number {
    if (b < GCD_PRECISION) {
      return a;
    } else {
      return this.gcd(b, Math.floor(a % b));
    }
  }
}
