import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-game-log',
  templateUrl: './game-log.component.html',
  styleUrls: ['./game-log.component.scss']
})
export class GameLogComponent {
  @Input() logs!: string[]

  ngOnChanges(){
    setTimeout(()=>{
      const gameLogTextarea = document.getElementById('game-log')
      gameLogTextarea?.scroll({behavior: 'smooth', top: gameLogTextarea?.scrollHeight})
    }, 50)
  }
}
