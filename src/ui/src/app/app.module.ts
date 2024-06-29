import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { PlayerInfoComponent } from './player-info/player-info.component';
import { HotelInfoComponent } from './hotel-info/hotel-info.component';
import { GameLogComponent } from './game-log/game-log.component';
import { MergeDecisionsComponent } from './merge-decisions/merge-decisions.component';
import { BoardComponent } from './board/board.component';

@NgModule({
  declarations: [
    AppComponent,
    PlayerInfoComponent,
    HotelInfoComponent,
    GameLogComponent,
    MergeDecisionsComponent,
    BoardComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
