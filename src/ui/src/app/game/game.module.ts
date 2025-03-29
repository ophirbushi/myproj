import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameComponent } from './game.component';
import { PlayerInfoComponent } from './player-info/player-info.component';
import { HotelInfoComponent } from './hotel-info/hotel-info.component';
import { GameLogComponent } from './game-log/game-log.component';
import { MergeDecisionsComponent } from './merge-decisions/merge-decisions.component';
import { BoardComponent } from './board/board.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    GameComponent,
    PlayerInfoComponent,
    HotelInfoComponent,
    GameLogComponent,
    MergeDecisionsComponent,
    BoardComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([
      { path: ':gameId', component: GameComponent }
    ])
  ]
})
export class GameModule { }
