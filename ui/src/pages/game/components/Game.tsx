import { useState } from "react";
import {
  Box,
  Drawer,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import { State } from '../../../../../engine/models';

import GameBoard from "./GameBoard";
import PlayerBar from "./PlayerBar";
import TileHandBar from "./TileHandBar";
import PhaseBanner from "./PhaseBanner";
import HotelsInfo from "./HotelsInfo";
import GameLog from "./GameLog";
import HotelsInfoMini from './HotelsInfoMini';

export default function Game({ gameState }: { gameState: State }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  // const isMobile = true;

  const [leftDrawerOpen, setLeftDrawerOpen] = useState(false);
  const [rightDrawerOpen, setRightDrawerOpen] = useState(false);

  return (
    <Box display="flex" flexDirection="column" height="100vh">
      <PhaseBanner gameState={gameState} />
      <PlayerBar gameState={gameState} />

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
              bgcolor="grey.100"
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
          <Box width={240} p={2} bgcolor="grey.100">
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
          <GameBoard gameState={gameState} />
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
              bgcolor="grey.100"
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
          <Box width={240} p={2} bgcolor="grey.100">
            <GameLog gameState={gameState} />
          </Box>
        )}
      </Box>

      {/* Tile Hand Bar */}
      <Box p={1} bgcolor="grey.200">
        <TileHandBar gameState={gameState} />
      </Box>
    </Box>
  );
}
