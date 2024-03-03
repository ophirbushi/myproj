import { Component } from '@angular/core';
import { State } from '../../../engine/models'


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ui';
  state!: State
  input: any = null

  ngOnInit() {
    this.fetchState()
    setInterval(() => {
      this.fetchState()
    }, 1000)
  }

  async fetchState() {
    this.state = await fetch('http://localhost:3000/').then(res => res.json())
  }

  postInput() {
    fetch('http://localhost:3000/input', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input: +this.input })
    })
  }

  getArrayFromNumber(num: number) {
    let array = new Array(num)
    for (let i = 0; i < num; i++) {
      array[i] = i
    }
    return array
  }

  exists(tile: [number, number]) {
    return this.state.boardTiles.some(t => t[0] == tile[0] && t[1] == tile[1])
  }
}
