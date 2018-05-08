import { Component, OnInit, HostListener } from '@angular/core';
import { DecibelService } from './decibel/decibel.service';

@Component({
  selector: 'c-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public decibel = 0;

  constructor(
    private decibelService: DecibelService
  ) { }

  ngOnInit() {
    this.decibelService.decibel.subscribe((dB) => {
      this.decibel = Math.floor(Math.max(dB, this.decibel));
    });
  }
}
