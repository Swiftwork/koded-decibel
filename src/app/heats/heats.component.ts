import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DecibelService } from '../decibel/decibel.service';

export interface IParticipant {
  name: string;
  score: number;
}

export interface IHeat {
  name: string;
  participants: IParticipant[];
}

@Component({
  selector: 'c-heats',
  templateUrl: './heats.component.html',
  styleUrls: ['./heats.component.scss']
})
export class HeatsComponent implements OnInit {

  @Input('heats') heats: IHeat[] = [];

  @Output('switch') switch = new EventEmitter<IParticipant>();

  public decibel = 0;
  private participant: IParticipant;

  constructor(
    private decibelService: DecibelService,
  ) { }

  ngOnInit() {
    this.decibelService.decibel.subscribe((dB) => {
      this.decibel = Math.floor(Math.max(dB, this.decibel));
      if (this.participant) {
        this.participant.score = this.decibel;
      }
    });
  }

  public selectParticipant(participant: IParticipant) {
    this.decibel = 0;
    this.participant = participant;
    this.switch.emit(participant);
  }

  public isSelected(participant: IParticipant) {
    return this.participant && participant.name === this.participant.name;
  }

  isLeader(heat: IHeat, participant: IParticipant) {
    const highscore = heat.participants.reduce((max, current) => current.score > max ? current.score : max, 0);
    return participant.score > 0 && participant.score >= highscore;
  }
}
