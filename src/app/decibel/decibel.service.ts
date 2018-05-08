import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import DecibelMeter from 'decibel-meter';

@Injectable()
export class DecibelService {

  private $decibel = new Subject<number>();
  public decibel = this.$decibel.asObservable();

  private meter;

  constructor() {
    this.meter = new DecibelMeter();
    this.meter.sources.then(sources => console.log(sources));
  }

  start() {
    this.meter.listenTo(0, (dB, percent, value) => this.$decibel.next(dB + 100));
  }
}
