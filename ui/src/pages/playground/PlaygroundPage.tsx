import './PlaygroundPage.css';
import GameBoardNew from '../game/components-new/GameBoard';
import { gameState } from './state';


export default function PlaygroundPage() {
  return (
    <div className="playground-container">
      <div className="turn-indicator">
        <span>Turn indication</span>
      </div>

      <div className="players-container">
        {[0, 1, 2, 3].map((i) => (
          <div className="player-card common-bordered common-padded" key={'playerIndex-' + i}>
            <div className="player-header">
              <span>Player {i + 1}</span>
              <span>${gameState.cash[i]}</span>
            </div>
            <ul className="player-card-extended">
              {gameState.config.hotels.map((h) => (
                <li key={i + h.hotelName} className='player-card-extended-stock'>
                  <div>{h.hotelName[0]}</div>
                  <div>?</div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="game-area">
        <div className="player-tiles">
          <ul>
            {gameState.playerTiles[0].tiles.map(([x, y], i) => (
              <li key={i} className="tile-card common-bordered common-padded">
                {String.fromCharCode(65 + x)}{y + 1}
              </li>
            ))}
          </ul>
        </div>
        <GameBoardNew gameState={gameState}></GameBoardNew>
        <div className="hotels-list">
          <ul>
            {gameState.config.hotels.map((h, i) => (
              <li key={i + h.hotelName} className="hotel-item common-bordered common-padded">
                <div>
                  <span className="hotel-initial">{h.hotelName[0]}</span>
                  <span>(8)</span>
                </div>
                <span>$200</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}