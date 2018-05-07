import { Color } from '../utilities/color';

export interface LightParams {
  radius: number;
  blur: number;
  color: Color;
}

export interface LightMovement {
  x: number;
  y: number;
  angle: number;
  velocity: number;
}

export class Light implements LightParams, LightMovement {
  public radius = 50;
  public blur = 55;
  public color: Color = new Color(0, 125, 125, 0.1);

  public x = 0;
  public y = 0;
  public angle = 0;
  public velocity = 0;

  static White(
    radius = 1,
    alpha = 0.1,
  ) {
    return new Light({
      radius: radius,
      blur: 0,
      color: new Color(255, 255, 255, alpha)
    });
  }

  constructor(
    params: LightParams,
  ) {
    this.radius = params.radius;
    this.blur = params.blur;
    this.color = params.color;
  }

  public setMovement(movement: LightMovement) {
    this.x = movement.x;
    this.y = movement.y;
    this.angle = movement.angle;
    this.velocity = movement.velocity;
  }
}
