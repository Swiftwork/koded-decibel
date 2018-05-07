import { Color } from '../../utilities/color';

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
  public radius: number = 50;
  public blur: number = 55;
  public color: Color = new Color(0, 125, 125, 0.1);

  public x: number = 0;
  public y: number = 0;
  public angle: number = 0;
  public velocity: number = 0;

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

  static White(
    radius: number = 1,
    alpha: number = 0.1,
  ) {
    return new Light({
      radius: radius,
      blur: 0,
      color: new Color(255, 255, 255, alpha)
    });
  }
}