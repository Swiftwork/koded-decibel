export class Color {

  constructor(
    public r: number = 0,
    public g: number = 0,
    public b: number = 0,
    public a: number = 1,
  ) {

  }

  //------------------------------------------------------------------------------------
  // MANIPULATIONS
  //------------------------------------------------------------------------------------

  //------------------------------------------------------------------------------------
  // FROM INPUTS
  //------------------------------------------------------------------------------------

  /**
   * Returns a new {Color} from and hex color.
   * @param alphaHexColor is the hex color string in the format of #RRGGBB.
   */
  static FromHex(hexColor: string): Color {
    const alphaHexColor = hexColor.indexOf('#') > -1 ?
      hexColor.slice(0, 1) + 'FF' + hexColor.slice(1) : 'FF' + hexColor;
    return Color.FromAHex(alphaHexColor);
  }

  /**
   * Returns a new {Color} from and alpha hex color.
   * @param alphaHexColor is the alpha hex color string in the format of #AARRGGBB.
   */
  static FromAHex(alphaHexColor: string): Color {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(alphaHexColor);
    return result ? new Color(parseInt(result[2], 16), parseInt(result[3], 16), parseInt(result[4], 16), parseInt(result[1], 16) / 255) : null;
  }

  static FromHSL(hue: number, saturation: number, lightness: number) {
    return Color.FromHSLA(hue, saturation, lightness, 1);
  }

  static FromHSLA(hue: number, saturation: number, lightness: number, alpha: number) {
    let r, g, b;
    if (saturation == 0) {
      r = g = b = lightness;
    } else {
      let q = lightness < 0.5 ? lightness * (1 + saturation) : lightness + saturation - lightness * saturation;
      let p = 2 * lightness - q;
      r = Color.hueToRgb(p, q, hue + 1 / 3);
      g = Color.hueToRgb(p, q, hue);
      b = Color.hueToRgb(p, q, hue - 1 / 3);
    }
    return new Color(r * 255, g * 255, b * 255, alpha);
  }

  //------------------------------------------------------------------------------------
  // TO OUTPUTS
  //------------------------------------------------------------------------------------

  /**
   * Returns a new hsl formatted string.
   */
  public toHSLString(): string {
    const hsl = this.hsl;
    return 'hsl(' + hsl.hue + ',' + hsl.saturation + '%,' + hsl.lightness + '%)';
  }

  /**
   * Returns a new hsla formatted string.
   */
  public toHSLAString() {
    const hsla = this.hsla;
    return 'hsla(' + hsla.hue + ',' + hsla.saturation + '%,' + hsla.lightness + '%,' + hsla.alpha + ')';
  }

  /**
   * Returns a new hsla formatted string.
   */
  public toRGBString(): string {
    return 'rgb(' + this.r + ',' + this.g + ',' + this.b + ')';
  }

  /**
   * Returns a new hsla formatted string.
   */
  public toRGBAString(): string {
    return 'rgba(' + this.a + ',' + this.g + ',' + this.b + ',' + this.a + ')';
  }

  //------------------------------------------------------------------------------------
  // GETTERS
  //------------------------------------------------------------------------------------

  public get hsl(): { hue: number, saturation: number, lightness: number } {
    const r = this.r / 255;
    const g = this.g / 255;
    const b = this.b / 255;

    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max == min) {
      h = s = 0; // achromatic
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
    }
    return {
      hue: Math.floor(h * 60),
      saturation: Math.floor(s * 100),
      lightness: Math.floor(l * 100),
    }
  }

  public get hsla(): { hue: number, saturation: number, lightness: number, alpha: number } {
    return Object.assign({ alpha: this.a }, this.hsl);
  }

  //------------------------------------------------------------------------------------
  // HELPERS
  //------------------------------------------------------------------------------------

  static hueToRgb(p: number, q: number, t: number) {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  }
}