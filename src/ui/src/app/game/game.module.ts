import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameComponent } from './game.component';
import { PlayerInfoComponent } from './player-info/player-info.component';
import { HotelInfoComponent } from './hotel-info/hotel-info.component';
import { MergeDecisionsComponent } from './merge-decisions/merge-decisions.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    GameComponent,
    PlayerInfoComponent,
    HotelInfoComponent,
    MergeDecisionsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([
      { path: '', component: GameComponent }
    ])
  ]
})
export class GameModule { }
