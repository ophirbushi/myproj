import { useMemo, useState } from "react";
import {
  Box,
  Button,
  Drawer,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import { State, Tile } from '../../../../../engine/models';

import GameBoard from "./GameBoard";
import PlayerBar from "./PlayerBar";
import TileHandBar from "./TileHandBar";
import PhaseBanner from "./PhaseBanner";
import HotelsInfo from "./HotelsInfo";
import GameLog from "./GameLog";
import HotelsInfoMini from './HotelsInfoMini';
import { LocalPlayerIndex } from '../models/game.models';
import { getActivePlayerIndex } from '../utils/localPlayer';
import { isPermanentlyIllegalTile, isTemporarilyIllegalTile } from '../../../../../engine/helpers';

export default function Game(
  { gameState, localPlayerIndex }: { gameState: State, localPlayerIndex: LocalPlayerIndex }
) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  // const isMobile = true;

  const [leftDrawerOpen, setLeftDrawerOpen] = useState(false);
  const [rightDrawerOpen, setRightDrawerOpen] = useState(false);
  const [selectedTile, setSelectedTile] = useState<Tile | null>(null);
  const [hoveredTile, setHoveredTile] = useState<Tile | null>(null);

  const derivedState = useMemo(() => {
    let localPlayerTiles: Tile[] = [];
    let localPlayerUnplayableTiles: Tile[] = [];

    if (localPlayerIndex != null) {
      let playerIndex = -1;
      if (localPlayerIndex === 'all') {
        playerIndex = getActivePlayerIndex(gameState);
      } else {
        playerIndex = localPlayerIndex;
      }
      localPlayerTiles = gameState.playerTiles[playerIndex].tiles;
      localPlayerUnplayableTiles = localPlayerTiles.filter((tile) => {
        return isTemporarilyIllegalTile(gameState, tile) || isPermanentlyIllegalTile(gameState, tile);
      });
    }
    return {
      localPlayerTiles,
      localPlayerUnplayableTiles
    };
  }, [gameState, localPlayerIndex]);

  const sendTilePlacement = (tile: Tile) => {
  }

  return (
    <Box display="flex" flexDirection="column" height="100vh">
      <PhaseBanner gameState={gameState} localPlayerIndex={localPlayerIndex} />
      <PlayerBar gameState={gameState} localPlayerIndex={localPlayerIndex} />

      <Box display="flex" flex={1} overflow="hidden" position="relative">
        {/* Left Strip (Always visible on mobile) */}
        {isMobile ? (
          <>
            <Box
              position="absolute"
              top={0}
              left={0}
              height="100%"
              width={72}
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="start"
              py={1}
              gap={1}
              sx={{
                zIndex: 10
              }}
              onClick={() => setLeftDrawerOpen(true)}
            >
              <HotelsInfoMini gameState={gameState} />
            </Box>
            <Drawer
              anchor="left"
              open={leftDrawerOpen}
              onClose={() => setLeftDrawerOpen(false)}
            >
              <Box width={240} p={2}>
                <HotelsInfo gameState={gameState} />
              </Box>
            </Drawer>
          </>
        ) : (
          <Box width={240} p={2} >
            <HotelsInfo gameState={gameState} />
          </Box>
        )}

        {/* Main Board */}
        <Box
          flex={1}
          display="flex"
          justifyContent="center"
          alignItems="center"
          overflow="auto"
        >
          <GameBoard gameState={gameState} isMobile={isMobile}
            selectedTile={selectedTile}
            setSelectedTile={setSelectedTile}
            hoveredTile={hoveredTile}
            setHoveredTile={setHoveredTile}
            localPlayerTiles={derivedState.localPlayerTiles}
          />
        </Box>

        {/* Right Panel / Drawer */}
        {isMobile ? (
          <>
            {/* Always-visible collapsed strip on the right */}
            <Box
              position="absolute"
              top={0}
              right={0}
              height="100%"
              width={72}
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="start"
              py={1}
              gap={1}
              sx={{
                zIndex: 10
              }}
              onClick={() => setRightDrawerOpen(true)}
            >
              <Box fontSize={10} textAlign="center" >
                Log
              </Box>
            </Box>

            <Drawer
              anchor="right"
              open={rightDrawerOpen}
              onClose={() => setRightDrawerOpen(false)}
            >
              <Box width={240} p={2}>
                <GameLog gameState={gameState} />
              </Box>
            </Drawer>
          </>
        ) : (
          <Box width={240} p={2}>
            <GameLog gameState={gameState} />
          </Box>
        )}
      </Box>

      {/* Tile Hand Bar */}
      <Box p={1} bgcolor="grey.200">
        <TileHandBar
          tiles={derivedState.localPlayerTiles}
          unplayableTiles={derivedState.localPlayerUnplayableTiles}
          selectedTile={selectedTile}
          onSelect={(tile) => setSelectedTile(tile)}
          sendTilePlacement={sendTilePlacement}
          hoveredTile={hoveredTile}
          setHoveredTile={setHoveredTile}
        />
      </Box>
    </Box>
  );
}
