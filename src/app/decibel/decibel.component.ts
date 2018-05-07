import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'c-decibel',
  templateUrl: './decibel.component.html',
  styleUrls: ['./decibel.component.scss']
})
export class DecibelComponent implements OnInit {

  @Input() min = 20;
  @Input() max = 100;
  @Input() step = 5;

  public steps: number[];

  constructor() { }

  ngOnInit() {
    this.steps = new Array((this.max - this.min) / this.step);
  }

}
