import { Component, OnInit, HostListener } from '@angular/core';
import { DecibelService } from './decibel/decibel.service';
import { IParticipant, IHeat } from './heats/heats.component';


@Component({
  selector: 'c-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public decibel = 0;
  public heats: IHeat[] = [];

  constructor(
    private decibelService: DecibelService
  ) { }

  ngOnInit() {
    let participants = localStorage.getItem('participants');
    if (!participants) {
      participants = window.prompt('Whom are the participants? Format "joe,jose,johan|mike,mick,may"');
      localStorage.setItem('participants', participants);
    }

    this.decibelService.decibel.subscribe((dB) => {
      this.decibel = Math.floor(Math.max(dB, this.decibel));
    });
  }

  public formatEvent(event: string) {
    event = event.replace(/ ?\| ?/g, '|').replace(/ ?, ?/g, ',');
    const heats = event.split('|');
    heats.forEach(heat => {
      this.heats.push({
        name: '',
        participants: heat.split(',').map(name => ({
          name: name,
          score: 0,
        })),
      });
    });
  }
}
