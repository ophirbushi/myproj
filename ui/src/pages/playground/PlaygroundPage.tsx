import { State } from '../../../../engine/models';
import GameBoardNew from '../game/components-new/GameBoard';

const gameState: State = { "config": { "numberOfPlayers": 4, "hotels": [{ "hotelName": "Riviera", "prestige": 0 }, { "hotelName": "Holiday", "prestige": 0 }, { "hotelName": "LasVegas", "prestige": 1 }, { "hotelName": "Park", "prestige": 1 }, { "hotelName": "Olympia", "prestige": 1 }, { "hotelName": "Europlaza", "prestige": 2 }, { "hotelName": "Continental", "prestige": 2 }], "initCashPerPlayer": 5000, "maxStocks": 24, "maxStocksPurchasePerTurn": 3, "possibleGameEndHotelSize": 42, "unmergableHotelSize": 11, "numberOfTilesPerPlayer": 6, "priceTable": { "init": 200, "step": 100, "levels": [2, 3, 4, 5, 6, 11, 21, 31, 41] }, "boardHeight": 9, "boardWidth": 12 }, "cash": [5000, 5000, 5000, 5000], "hotels": [], "playerTiles": [{ "playerIndex": 0, "tiles": [[9, 3], [7, 8], [9, 2], [3, 5], [10, 7], [11, 8]] }, { "playerIndex": 1, "tiles": [[8, 2], [4, 0], [0, 5], [2, 1], [1, 5], [9, 4]] }, { "playerIndex": 2, "tiles": [[2, 3], [11, 5], [4, 3], [9, 1], [11, 4], [6, 3]] }, { "playerIndex": 3, "tiles": [[10, 5], [7, 1], [5, 6], [2, 6], [1, 3], [3, 8]] }], "boardTiles": [[2, 7], [8, 8], [6, 7], [9, 0]], "discardedTiles": [[2, 7], [8, 8], [6, 7], [9, 0]], "tilesPile": [[2, 4], [8, 1], [7, 2], [11, 6], [5, 5], [3, 4], [1, 7], [8, 7], [11, 3], [10, 0], [0, 8], [0, 2], [7, 3], [9, 5], [10, 8], [5, 1], [0, 1], [6, 4], [4, 8], [0, 3], [8, 0], [8, 6], [11, 1], [9, 6], [6, 2], [4, 7], [7, 6], [11, 2], [7, 4], [5, 4], [11, 7], [6, 1], [3, 7], [9, 7], [1, 0], [0, 0], [5, 0], [2, 0], [10, 1], [7, 7], [10, 3], [5, 3], [5, 2], [9, 8], [0, 6], [7, 5], [4, 2], [11, 0], [4, 4], [8, 3], [3, 6], [8, 5], [6, 6], [5, 8], [3, 0], [0, 7], [6, 5], [10, 6], [2, 5], [4, 5], [1, 8], [6, 0], [4, 6], [3, 2], [1, 4], [10, 4], [4, 1], [1, 6], [1, 1], [10, 2], [7, 0], [1, 2], [6, 8], [8, 4], [2, 8], [3, 1], [3, 3], [2, 2], [0, 4], [5, 7]], "stocks": { "0": [0, 0, 0, 0], "1": [0, 0, 0, 0], "2": [0, 0, 0, 0], "3": [0, 0, 0, 0], "4": [0, 0, 0, 0], "5": [0, 0, 0, 0], "6": [0, 0, 0, 0] }, "currentPlayerIndex": 0, "decidingPlayerIndex": -1, "phaseId": "build", "mergingHotelIndex": -1 }

export default function PlaygroundPage() {
  return (

    <div style={{ width: '100vw', height: '100vh', }}>

      <div style={{ background: 'rgb(200, 180, 240)', textAlign: 'center' }}>
        <span>Turn indication</span>
      </div>

      <div style={{ display: 'flex', gap: '32px', margin: '12px 20px', justifyContent: 'center' }}>

        {[0, 1, 2, 3].map((i) => (
          <div style={{ border: '1px solid', padding: '12px', width: '20%', borderRadius: '8px' }} key={'playerIndex-' + i}>
            <div style={{ fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>Player {i + 1}</span>
              <span>${gameState.cash[i]}</span>
            </div>
            {/* <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', justifyContent: 'space-between', textAlign: 'center' }}>
              {gameState.config.hotels.map((h) => (
                <li key={i + h.hotelName} style={{ display: 'flex', flexDirection: 'column', width: '14px' }}>
                  <div>{h.hotelName[0]}</div>
                  <div>?</div>
                </li>
              ))}

            </ul> */}
          </div>
        ))}

      </div>

      <div style={{ display: 'flex', justifyContent: 'center' }}>

        <div style={{ width: '88px' }}>
          <ul style={{ margin: '8px 20px', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', justifyContent: 'space-between' }}>
            {gameState.playerTiles[0].tiles.map(([x, y], i) => (
              <li key={i} style={{ border: '1px solid', padding: '8px', borderRadius: '8px', textAlign: 'center' }} >
                {String.fromCharCode(65 + x)}{y + 1}
              </li>
            ))}
          </ul>
        </div>
        <GameBoardNew gameState={gameState}></GameBoardNew>
        <div style={{ width: '180px' }}>
          <ul style={{ margin: '8px 20px', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', justifyContent: 'space-between' }}>
            {gameState.config.hotels.map((h, i) => (
              <li key={i + h.hotelName} style={{ display: 'flex', gap: '8px', flexDirection: 'row', padding: '4px 12px', borderRadius: '8px', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ display: 'inline-block', minWidth: '18px', textAlign: 'center' }}>{h.hotelName[0]}</span>
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
