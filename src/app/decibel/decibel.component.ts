import { Component, OnInit, Input, HostListener } from '@angular/core';
import { DecibelService } from './decibel.service';

import Levels from './decibel.levels.json';

export interface IDecibelLevel {
  source: string;
  min: number;
  max: number;
}

@Component({
  selector: 'c-decibel',
  templateUrl: './decibel.component.html',
  styleUrls: ['./decibel.component.scss']
})
export class DecibelComponent implements OnInit {

  @Input() min = 0;
  @Input() max = 120;
  @Input() step = 10;

  public steps: number[];
  public decibel: number;
  public levels: IDecibelLevel = Levels.reverse();

  constructor(
    private decibelService: DecibelService,
  ) { }

  ngOnInit() {

    this.steps = new Array((this.max - this.min) / this.step + 1)
      .fill(0)
      .map((value, index) => this.step * index + this.min)
      .reverse();

    this.decibelService.decibel.subscribe((dB) => {
      this.decibel = dB;
    });
  }

  calculateWidth(index: number) {
    return 100 - (80 / this.steps.length * index);
  }

  calculateMargin(index: number) {
    return 80 / this.steps.length * index / 2;
  }

  @HostListener('click')
  start() {
    this.decibelService.start();
  }
}
