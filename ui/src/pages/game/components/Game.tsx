import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Drawer,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import { State, Tile } from '../../../../../engine/models';

import GameBoard from "./GameBoard";
import PlayerBar from "./PlayerBar";
import TileHandBar from "./TileHandBar";
import PhaseBanner from "./PhaseBanner";
// import HotelsInfo from "./HotelsInfo";
import GameLog from "./GameLog";
import HotelsInfoMini from './HotelsInfoMini';
import { LocalPlayerIndex } from '../models/game.models';
import { getActivePlayerIndex } from '../utils/localPlayer';
import { isPermanentlyIllegalTile, isTemporarilyIllegalTile } from '../../../../../engine/helpers';
import { fetchGameState, postGameInput } from '../services/gameBackendService';

interface GameProps {
  localPlayerIndex: LocalPlayerIndex;
}

export default function Game({ localPlayerIndex }: GameProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  // const isMobile = true;
  const [gameState, setGameState] = useState<State | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const [leftDrawerOpen, setLeftDrawerOpen] = useState(false);
  const [rightDrawerOpen, setRightDrawerOpen] = useState(false);
  const [selectedTile, setSelectedTile] = useState<Tile | null>(null);
  const [hoveredTile, setHoveredTile] = useState<Tile | null>(null);

  useEffect(() => {
    fetchGameState().then(({ state, logs }) => {
      setGameState(state);
      setLogs(logs);
    });
  }, []);

  const derivedState = useMemo(() => {
    if (!gameState) {
      return {
        localPlayerTiles: [],
        localPlayerUnplayableTiles: []
      };
    }
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

  const postIndexInput = async (index: number) => {
    const { state, logs } = await postGameInput(index);
    setGameState(state);
    setLogs(logs);
  };

  if (!gameState) {
    return <div>Loading...</div>;
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
              <HotelsInfoMini gameState={gameState} postInput={postIndexInput} />
            </Box>
            <Drawer
              anchor="left"
              open={leftDrawerOpen}
              onClose={() => setLeftDrawerOpen(false)}
            >
              <Box width={240} p={2}>
                <HotelsInfoMini gameState={gameState} postInput={postIndexInput} fontSize={18} />
              </Box>
            </Drawer>
          </>
        ) : (
          <Box width={240} p={2} >
            <HotelsInfoMini gameState={gameState} postInput={postIndexInput} fontSize={18} />
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
              <Box width={320} p={2} display="flex" flexDirection="column" height="100%" justifyContent={"center"}>
                <GameLog logs={logs} />
              </Box>
            </Drawer>
          </>
        ) : (
          <Box width={320} p={2} display="flex" flexDirection="column" height="100%" justifyContent={"center"}>
            <GameLog logs={logs} />
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
          sendTilePlacement={postIndexInput}
          hoveredTile={hoveredTile}
          setHoveredTile={setHoveredTile}
        />
      </Box>
    </Box>
  );
}
