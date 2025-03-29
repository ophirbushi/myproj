import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameSetupComponent } from './game-setup.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    GameSetupComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: GameSetupComponent }
    ]),
    FormsModule
  ]
})
export class GameSetupModule { }
