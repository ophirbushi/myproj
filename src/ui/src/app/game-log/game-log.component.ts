import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-game-log',
  templateUrl: './game-log.component.html',
  styleUrls: ['./game-log.component.scss']
})
export class GameLogComponent {
  @Input() log!: string[]
}
