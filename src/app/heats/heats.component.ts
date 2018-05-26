import { Component, OnInit, Input } from '@angular/core';

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

  constructor() { }

  ngOnInit() {
  }

}
