import { Typography, Paper, Stack, Button } from "@mui/material";

type Tile = [number, number];

interface TileHandBarProps {
  tiles: Tile[];
  selectedTile: Tile | null;
  onSelect: (tile: Tile | null) => void;
  unplayableTiles?: Tile[];
  label?: string; // For ALL mode or debug
  sendTilePlacement: (tileIndex: number) => any
  hoveredTile: Tile | null
  setHoveredTile: (tile: Tile | null) => any,
  isBuildPhase: boolean
}

function tileToLabel([x, y]: Tile): string {
  return `${String.fromCharCode(65 + x)}${y + 1}`; // A1, B5, etc.
}

function isSameTile(a: Tile, b: Tile): boolean {
  return a[0] === b[0] && a[1] === b[1];
}

export default function TileHandBar({
  tiles,
  selectedTile,
  onSelect,
  unplayableTiles = [],
  label,
  sendTilePlacement,
  hoveredTile,
  setHoveredTile,
  isBuildPhase
}: TileHandBarProps) {
  return (
    <Paper className={isBuildPhase ? '' : 'isDisabled'} elevation={3} sx={{ p: 1, overflowX: "auto", display: 'flex', justifyContent: 'space-evenly' }}>
      <Stack spacing={1}>
        {label && (
          <Typography variant="caption" fontWeight={600}>
            {label}
          </Typography>
        )}
        <Stack direction="row" spacing={1} overflow="auto">
          {tiles.map((tile, i) => {
            const label = tileToLabel(tile);
            const isSelected = selectedTile && isSameTile(tile, selectedTile);
            const isHovered = hoveredTile && isSameTile(tile, hoveredTile);
            const isDisabled = unplayableTiles.some(t => isSameTile(t, tile));

            let opacity = 1;

            if (isDisabled) {
              opacity = 0.4;
            } else if (isHovered) {
              opacity = 0.7;
            }

            return (
              <Button
                key={i}
                variant={isSelected ? "contained" : "outlined"}
                color={isDisabled ? "inherit" : "primary"}
                disabled={isDisabled}
                onClick={() => isSelected ? onSelect(null) : onSelect(tile)}
                onMouseEnter={() => setHoveredTile(tile)}
                onMouseLeave={() => setHoveredTile(null)}
                sx={{
                  minWidth: 40,
                  px: 1,
                  fontSize: "0.8rem",
                  opacity,
                }}
              >
                {label}
              </Button>
            );
          })}
        </Stack>
      </Stack>
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          if (selectedTile) {
            const tileIndex = tiles.findIndex(t => isSameTile(t, selectedTile));
            if (tileIndex === -1) {
              console.error("Selected tile not found in hand");
              return;
            }
            sendTilePlacement(tileIndex);
          }
        }}
        disabled={!selectedTile}
      >
        Confirm Tile
      </Button>
    </Paper>
  );
}
