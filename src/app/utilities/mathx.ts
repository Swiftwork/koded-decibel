export class MathX {
  /*
   * Returns a random value between a given maximum and minimum.
   * @param min is the lower constraint for the random number.
   * @param max is the upper constraint for the random number.
   */
  static randomBetween(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  /*
   * Returns a random value between a given maximum and minimum.
   * @param min is the lower constraint for the random number.
   * @param max is the upper constraint for the random number.
   */
  static roundDecimals(value: number, precision: number): number {
    return Math.round(value * Math.pow(10, precision)) / Math.pow(10, precision);
  }

  /*
   * Returns the value contrained by a minimum and maximum.
   * @param value which is to be contraint by the min and max.
   * @param min is the lower constraint for the value.
   * @param max is the upper constraint for the value.
   */
  static clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(value, max));
  }

  /*
   * Returns a number inside a linear interpolation based on the alpha.
   * @param min is the starting value for the linear interpolation.
   * @param max is the finishing value for the linear interpolation.
   * @param alpha is the percentage at which to select the value.
   */
  static lerp(min: number, max: number, alpha: number): number {
    return min * (1 - alpha) + max * alpha;
  }
}
