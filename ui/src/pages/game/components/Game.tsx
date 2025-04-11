import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Drawer,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import { Input, State, Tile } from '../../../../../engine/models';

import GameBoard from "./GameBoard";
import PlayerBar from "./PlayerBar";
import TileHandBar from "./TileHandBar";
import PhaseBanner from "./PhaseBanner";
// import HotelsInfo from "./HotelsInfo";
import GameLog from "./GameLog";
import HotelsInfoMini from './HotelsInfoMini';
import { LocalPlayerIndex } from '../models/game.models';
import { getActivePlayerIndex } from '../utils/localPlayer';
import { isPermanentlyIllegalTile, isPossibleGameEnd, isTemporarilyIllegalTile } from '../../../../../engine/helpers';
import { fetchGameState, postGameInput } from '../services/gameBackendService';
import { FetchStateResponse } from '../../../../../shared/contract';
import BuyStocks from './BuyStocks';
import MergeDecisions from './MergerDecisions';
import GameOver from './GameOver';

export default function Game({ localPlayer: localPlayer }: { localPlayer: LocalPlayerIndex }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  // const isMobile = true;
  const [gameState, setGameState] = useState<State | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const [leftDrawerOpen, setLeftDrawerOpen] = useState(false);
  const [rightDrawerOpen, setRightDrawerOpen] = useState(false);
  const [selectedTile, setSelectedTile] = useState<Tile | null>(null);
  const [hoveredTile, setHoveredTile] = useState<Tile | null>(null);
  const [gameIsEnding, setGameIsEnding] = useState<boolean>(false);

  const updateGameStateAndLogs = ({ state, logs }: FetchStateResponse) => {
    setGameState(state);
    setLogs(logs);
    setSelectedTile(null);
  };

  const postInput = async <T = any>(input: Input<T>) => {
    const res = await postGameInput(input);
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
    let localPlayerReplaceableTiles: Tile[] = [];
    let possibleGameEnd = false;
    if (!gameState) {
      return {
        activePlayerIndex,
        localPlayerIndex,
        isLocalPlayerTurn,
        localPlayerTiles,
        localPlayerUnplayableTiles,
        localPlayerReplaceableTiles,
        possibleGameEnd
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
        return isTemporarilyIllegalTile(gameState, tile);
      });
      localPlayerReplaceableTiles = localPlayerTiles.filter((tile) => {
        return isPermanentlyIllegalTile(gameState, tile);
      });
    }
    possibleGameEnd = isPossibleGameEnd(gameState)
    return {
      activePlayerIndex,
      localPlayerIndex,
      isLocalPlayerTurn,
      localPlayerTiles,
      localPlayerUnplayableTiles,
      localPlayerReplaceableTiles,
      possibleGameEnd
    };
  }, [gameState, localPlayer]);

  const endTheGame = (gameState: State) => {
    setGameIsEnding(true);
    postInput({ playerIndex: gameState.currentPlayerIndex, data: 'finish' });
  };

  useEffect(() => {
    if (!gameState || !derivedState.possibleGameEnd) {
      return;
    }
    setTimeout(() => {
      if (confirm('Do you want to end the game now?')) {
        endTheGame(gameState)
      }
    }, 500)

  }, [gameState?.currentPlayerIndex ?? -1, derivedState.possibleGameEnd])

  if (!gameState) {
    return <div>Loading...</div>;
  }

  if (gameIsEnding && gameState.phaseId !== 'gameEnd') {
    return <div>Game over (Loading results...)</div>
  }

  const {
    isLocalPlayerTurn,
    localPlayerIndex,
    localPlayerTiles,
    localPlayerUnplayableTiles,
    localPlayerReplaceableTiles
  } = derivedState;

  return (
    <>
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
                <HotelsInfoMini gameState={gameState} postInput={postInput} localPlayerIndex={localPlayerIndex} />
              </Box>
              <Drawer
                anchor="left"
                open={leftDrawerOpen}
                onClose={() => setLeftDrawerOpen(false)}
              >
                <Box width={240} p={2}>
                  <HotelsInfoMini gameState={gameState} postInput={postInput} fontSize={18} localPlayerIndex={localPlayerIndex} />
                </Box>
              </Drawer>
            </>
          ) : (
            <Box width={240} p={2} >
              <HotelsInfoMini gameState={gameState} postInput={postInput} fontSize={18} localPlayerIndex={localPlayerIndex} />
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
            replaceableTiles={localPlayerReplaceableTiles}
            selectedTile={selectedTile}
            onSelect={(tile) => setSelectedTile(tile)}
            sendTilePlacement={postInput}
            hoveredTile={hoveredTile}
            setHoveredTile={setHoveredTile}
            isBuildPhase={gameState.phaseId === 'build'}
            playerIndex={localPlayerIndex}
          />
        </Box>

        <BuyStocks
          open={isLocalPlayerTurn && gameState.phaseId === 'invest'}
          onClose={() => postInput({ playerIndex: gameState.currentPlayerIndex, data: [] })}
          onConfirm={(decisions) => postInput(decisions)}
          localPlayerIndex={localPlayerIndex}
          gameState={gameState}
          isMobile={isMobile}
        ></BuyStocks>

        <MergeDecisions gameState={gameState} localPlayerIndex={localPlayerIndex}
          onClose={() => { }}
          onConfirm={(decisions) => postInput(decisions)}
          open={gameState.phaseId === 'mergeDecide' && gameState.decidingPlayerIndex === localPlayerIndex}
        ></MergeDecisions>

        <GameOver open={gameState.phaseId === 'gameEnd'} onClose={() => { }} gameState={gameState}></GameOver>
      </Box>
    </>
  );
}
