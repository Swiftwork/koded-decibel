import { Component, OnInit, Input, HostListener } from '@angular/core';
import { DecibelService } from './decibel.service';

@Component({
  selector: 'c-decibel',
  templateUrl: './decibel.component.html',
  styleUrls: ['./decibel.component.scss']
})
export class DecibelComponent implements OnInit {

  @Input() min = 0;
  @Input() max = 100;
  @Input() step = 5;

  public steps: number[];
  public decibel: number;

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

  @HostListener('click')
  start() {
    this.decibelService.start();
  }
}
