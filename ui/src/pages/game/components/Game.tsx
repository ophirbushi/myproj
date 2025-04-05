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
import { fetchGameState, postGameInput, postGoBackOneState } from '../services/gameBackendService';
import { FetchStateResponse } from '../../../../../shared/contract';
import BuyStocks from './BuyStocks';

interface GameProps {
  localPlayer: LocalPlayerIndex;
}

export default function Game({ localPlayer: localPlayer }: GameProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  // const isMobile = true;
  const [gameState, setGameState] = useState<State | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const [leftDrawerOpen, setLeftDrawerOpen] = useState(false);
  const [rightDrawerOpen, setRightDrawerOpen] = useState(false);
  const [selectedTile, setSelectedTile] = useState<Tile | null>(null);
  const [hoveredTile, setHoveredTile] = useState<Tile | null>(null);

  const updateGameStateAndLogs = ({ state, logs }: FetchStateResponse) => {
    setGameState(state);
    setLogs(logs);
    setSelectedTile(null);
  };

  const postInput = async <T = any>(input: T) => {
    const res = await postGameInput(input);
    updateGameStateAndLogs(res);
  };

  const goBackOneState = async () => {
    const res = await postGoBackOneState();
    updateGameStateAndLogs(res);
  };

  useEffect(() => {
    fetchGameState().then((res) => updateGameStateAndLogs(res));
  }, []);

  const derivedState = useMemo(() => {
    let activePlayerIndex = -1;
    let isLocalPlayerTurn = false;
    let localPlayerIndex = typeof localPlayer === 'number' ? localPlayer : -1;
    let localPlayerTiles: Tile[] = [];
    let localPlayerUnplayableTiles: Tile[] = [];
    if (!gameState) {
      return {
        activePlayerIndex,
        localPlayerIndex,
        isLocalPlayerTurn,
        localPlayerTiles,
        localPlayerUnplayableTiles
      };
    }
    activePlayerIndex = getActivePlayerIndex(gameState);
    if (localPlayer === 'all') {
      localPlayerIndex = activePlayerIndex;
    }
    if (localPlayerIndex > -1) {
      isLocalPlayerTurn = localPlayerIndex === activePlayerIndex;
      localPlayerTiles = gameState.playerTiles[localPlayerIndex].tiles;
      localPlayerUnplayableTiles = localPlayerTiles.filter((tile) => {
        return isTemporarilyIllegalTile(gameState, tile) || isPermanentlyIllegalTile(gameState, tile);
      });
    }
    return {
      activePlayerIndex,
      localPlayerIndex,
      isLocalPlayerTurn,
      localPlayerTiles,
      localPlayerUnplayableTiles,
    };
  }, [gameState, localPlayer]);

  if (!gameState) {
    return <div>Loading...</div>;
  }

  const {
    activePlayerIndex,
    isLocalPlayerTurn,
    localPlayerIndex,
    localPlayerTiles,
    localPlayerUnplayableTiles
  } = derivedState;

  return (
    <>
      <button onClick={() => postInput([])}>Send stock decision</button>
      <button onClick={() => goBackOneState()}>Back</button>

      <Box display="flex" flexDirection="column" height="90vh">
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
                <HotelsInfoMini gameState={gameState} postInput={postInput} />
              </Box>
              <Drawer
                anchor="left"
                open={leftDrawerOpen}
                onClose={() => setLeftDrawerOpen(false)}
              >
                <Box width={240} p={2}>
                  <HotelsInfoMini gameState={gameState} postInput={postInput} fontSize={18} />
                </Box>
              </Drawer>
            </>
          ) : (
            <Box width={240} p={2} >
              <HotelsInfoMini gameState={gameState} postInput={postInput} fontSize={18} />
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
              localPlayerTiles={localPlayerTiles}
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
            tiles={localPlayerTiles}
            unplayableTiles={localPlayerUnplayableTiles}
            selectedTile={selectedTile}
            onSelect={(tile) => setSelectedTile(tile)}
            sendTilePlacement={postInput}
            hoveredTile={hoveredTile}
            setHoveredTile={setHoveredTile}
            isBuildPhase={gameState.phaseId === 'build'}
          />
        </Box>

        <BuyStocks open={isLocalPlayerTurn && gameState.phaseId === 'invest'}
          hotelNames={gameState.config.hotels.map(h => h.hotelName)}
          playerCash={gameState.cash[activePlayerIndex]}
          maxBuyCount={gameState.config.maxStocksPurchasePerTurn}
          hotelPrices={[100, 100, 100, 100, 100, 100, 100]}
          onClose={() => postInput([])}
          availableStocks={[24, 24, 24, 24, 24, 24, 24]}
          onConfirm={() => postInput([])}
        ></BuyStocks>
      </Box>
    </>
  );
}
