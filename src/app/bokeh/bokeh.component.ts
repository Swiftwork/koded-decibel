import { Component, ElementRef, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { MathX } from '../utilities/mathx';
import { Color } from '../utilities/color';
import { Light, LightMovement } from './light';

export interface Theme {
  primary: Color;
  secondary: Color;
}

export interface BokehLayer {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  lights: Set<Light>;
}

@Component({
  selector: 'c-bokeh',
  templateUrl: './bokeh.component.html',
  styleUrls: ['./bokeh.component.scss']
})
export class BokehComponent implements OnInit, AfterViewInit, OnDestroy {

  static TRANSITION_DELAY = 500;

  @ViewChild('background') backgroundRef: ElementRef;
  @ViewChild('backgroundStore') backgroundStoreRef: ElementRef;
  @ViewChild('foreground') foregroundRef: ElementRef;

  public timing = {
    elapsed: 0,
    transition: BokehComponent.TRANSITION_DELAY,
    time: Date.now(),
  };

  private back: BokehLayer;
  private backStore: BokehLayer;
  private fore: BokehLayer;
  private theme: Theme;

  constructor(
    private store: TappsStore,
  ) {
    this.onResize = this.onResize.bind(this);
    this.onRender = this.onRender.bind(this);

    this.store.changes.pluck('theme').subscribe((theme: Theme) => {
      if (!theme) { return; }

      /* Transition from a previous theme */
      if (this.theme) { this.timing.transition = 0; }
      this.theme = theme;

      if (!this.back) { return; }
      this.createBackground();
      this.renderBackground();
    });
  }

  ngOnInit() {
    const test = Color.FromAHex('#90ef629f');
    // console.log(test.r, test.g, test.b, test.a);
    // console.log(test.toHSLAString());
    // const color = Color.toHSLA(light.hue, light.saturation, light.lightness, light.alpha);
  }

  ngAfterViewInit() {
    this.back = {
      canvas: this.backgroundRef.nativeElement,
      ctx: this.backgroundRef.nativeElement.getContext('2d'),
      lights: new Set<Light>(),
    };
    this.backStore = {
      canvas: this.backgroundStoreRef.nativeElement,
      ctx: this.backgroundStoreRef.nativeElement.getContext('2d'),
      lights: null,
    };
    this.fore = {
      canvas: this.foregroundRef.nativeElement,
      ctx: this.foregroundRef.nativeElement.getContext('2d'),
      lights: new Set<Light>(),
    };
    this.onResize();
    this.createBackground();
    this.renderBackground();
    this.createForeground();
    this.onRender();

    window.addEventListener('resize', this.onResize);
  }

  ngOnDestroy() {
    this.back.ctx.clearRect(0, 0, this.back.canvas.width, this.back.canvas.height);
    this.backStore.ctx.clearRect(0, 0, this.backStore.canvas.width, this.backStore.canvas.height);
    this.fore.ctx.clearRect(0, 0, this.fore.canvas.width, this.fore.canvas.height);

    this.back.lights.clear();
    this.fore.lights.clear();

    this.back = null;
    this.backStore = null;
    this.fore = null;
    window.removeEventListener('resize', this.onResize);
  }

  private onResize() {
    this.back.canvas.width = this.backStore.canvas.width = this.fore.canvas.width = window.innerWidth;
    this.back.canvas.height = this.backStore.canvas.height = this.fore.canvas.height = window.innerHeight;
    this.renderBackground();
  }

  private onRender() {
    const now = Date.now();
    const delta = now - this.timing.time;
    this.timing.elapsed += delta;
    this.timing.time = now;
    window.requestAnimationFrame(this.onRender);

    if (!this.back || !this.fore) {
      return;
    }

    this.fore.ctx.clearRect(0, 0, this.fore.canvas.width, this.fore.canvas.height);

    /* Fade in the new background */
    if (this.timing.transition < BokehComponent.TRANSITION_DELAY) {
      this.fore.ctx.save();
      this.fore.ctx.drawImage(this.backStore.canvas, 0, 0);
      this.fore.ctx.globalAlpha = this.timing.transition / BokehComponent.TRANSITION_DELAY;
      this.fore.ctx.drawImage(this.back.canvas, 0, 0);
      this.timing.transition += delta;
      this.fore.ctx.restore();

      /* Background */
    } else {
      this.fore.ctx.drawImage(this.back.canvas, 0, 0);
    }

    /* Foreground */
    this.fore.lights.forEach((light: Light) => {
      light.x += Math.cos(light.angle) * light.velocity;
      light.y += Math.sin(light.angle) * light.velocity;
      light.angle += MathX.randomBetween(-0.05, 0.05);

      this.renderLight(this.fore.ctx, light);

      if (light.x - light.radius > this.fore.canvas.width) { light.x = -light.radius; }
      if (light.x + light.radius < 0) { light.x = this.fore.canvas.width + light.radius; }
      if (light.y - light.radius > this.fore.canvas.height) { light.y = -light.radius; }
      if (light.y + light.radius < 0) { light.y = this.fore.canvas.height + light.radius; }
    });
  }

  private renderBackground() {
    /* Store the old background */
    this.backStore.ctx.clearRect(0, 0, this.backStore.canvas.width, this.backStore.canvas.height);
    this.backStore.ctx.drawImage(this.back.canvas, 0, 0);

    /* Create a new background */
    this.back.ctx.clearRect(0, 0, this.back.canvas.width, this.back.canvas.height);
    const gradient = this.back.ctx.createLinearGradient(0, 0, this.back.canvas.width, this.back.canvas.height);
    gradient.addColorStop(0, this.theme.primary.toHSLAString());
    gradient.addColorStop(1, this.theme.secondary.toHSLAString());
    this.back.ctx.fillStyle = gradient;
    this.back.ctx.fillRect(0, 0, this.back.canvas.width, this.back.canvas.height);

    this.back.lights.forEach((light: Light) => {
      this.renderLight(this.back.ctx, light);
    });
  }

  private renderLight(context: CanvasRenderingContext2D, light: Light) {
    const color = light.color.toHSLAString();
    // const color = Color.toHSLA(light.hue, light.saturation, light.lightness, light.alpha);
    context.save();
    if (light.blur > 0) {
      context.fillStyle = 'black';
    } else {
      context.fillStyle = color;
    }

    context.globalCompositeOperation = 'lighter';
    context.shadowColor = color;
    context.shadowBlur = light.blur;
    context.beginPath();
    context.arc(light.x, light.y, light.radius, 0, Math.PI * 2);
    context.closePath();
    context.fill();
    context.restore();
  }

  // ------------------------------------------------------------------------------------
  // CREATORS
  // ------------------------------------------------------------------------------------

  private createBackground() {
    const sizeBase = this.fore.canvas.width + this.fore.canvas.height;
    const primary = this.theme.primary.hsl;
    const secondary = this.theme.secondary.hsl;

    this.back.lights.clear();
    for (let i = 0; i < sizeBase * 0.05; i++) {

      let hue = 0;
      if (Math.abs(primary.hue - secondary.hue) < 180) {
        hue = MathX.randomBetween(primary.hue, secondary.hue) / 360;
      } else {
        hue = MathX.randomBetween(secondary.hue, 360 + primary.hue) / 360;
      } // Counter-clockwise

      const light = new Light({
        radius: MathX.randomBetween(1, sizeBase * 0.04), // Radius
        blur: MathX.randomBetween(10, sizeBase * 0.04), // Blur
        color: Color.FromHSLA(
          hue, // Color
          MathX.randomBetween(0.1, 0.7), // Saturation
          MathX.randomBetween(0.5, 0.7), // Brightness
          MathX.randomBetween(0.05, 0.1), // Alpha
        )
      });
      light.setMovement({
        x: MathX.randomBetween(0, this.fore.canvas.width),
        y: MathX.randomBetween(0, this.fore.canvas.height),
        angle: 0,
        velocity: 0,
      });
      this.back.lights.add(light);
    }
  }

  private createForeground() {
    const sizeBase = this.fore.canvas.width + this.fore.canvas.height;
    this.fore.lights.clear();
    for (let i = 0; i < sizeBase * 0.05; i++) {
      const light = Light.White(
        MathX.randomBetween(1, sizeBase * 0.01), // Radius
        MathX.randomBetween(0.01, 0.05), // Alpha
      );
      light.setMovement({
        x: MathX.randomBetween(0, this.fore.canvas.width),
        y: MathX.randomBetween(0, this.fore.canvas.height),
        angle: MathX.randomBetween(0, Math.PI),
        velocity: MathX.randomBetween(0.05, 0.2),
      });
      this.fore.lights.add(light);
    }
  }
}
