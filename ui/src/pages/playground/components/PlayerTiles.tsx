import { useCallback } from 'react';
import { isEqualTiles } from '../../../../../engine/helpers';
import { State, Tile } from '../../../../../engine/models';
import { Button } from '@mui/material';

export interface PlayerTilesProps {
  gameState: State;
  localPlayerIndex: number;
  availableToSelectTiles: Tile[];
  selectedTile: Tile | null;
  setSelectedTile: (tile: Tile | null) => any;
  confirmSelectedTile: (tile: Tile) => any;
}

export const PlayerTiles = ({ gameState, localPlayerIndex, selectedTile, availableToSelectTiles, setSelectedTile,
  confirmSelectedTile }: PlayerTilesProps) => {
  const isTileSelected = useCallback(
    (tile: Tile) => selectedTile != null && isEqualTiles(tile, selectedTile),
    [selectedTile]
  );

  const onTileClick = (tile: Tile) => {
    if (!availableToSelectTiles.some(t => isEqualTiles(t, tile))) {
      return;
    }
    setSelectedTile(isTileSelected(tile) ? null : tile);
  };

  if (typeof localPlayerIndex !== 'number' || localPlayerIndex < 0) {
    return null;
  }

  return (
    <div className="player-tiles">
      <ul>
        {gameState.playerTiles[localPlayerIndex].tiles.map((tile, i) => (
          <li key={i} >
            <div onClick={() => onTileClick(tile)} className={"tile-card common-bordered common-padded" + (
              (selectedTile && isEqualTiles(selectedTile, tile)) ? ' tile-card-selected' : ''
            ) + (
                (gameState.phaseId === 'build' && !availableToSelectTiles.some(t => isEqualTiles(t, tile))) ? ' tile-card-disabled' : ''
              )}>
              {String.fromCharCode(65 + tile[0])}{tile[1] + 1}
            </div>
          </li>
        ))}

        {selectedTile ? (
          <li>
            <Button variant='contained' onClick={() => confirmSelectedTile(selectedTile)}>Confirm</Button>
          </li>
        ) : null}
      </ul>
    </div>
  );
};
