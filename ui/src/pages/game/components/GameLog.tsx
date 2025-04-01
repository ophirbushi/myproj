import { useMemo } from 'react';
import TextField from '@mui/material/TextField';

export interface GameLogProps {
  logs: string[];
}

export default function GameLog({ logs }: GameLogProps) {
  useMemo(() => {
    const logContainer = document.querySelector('.log-container textarea');
    if (logContainer) {
      logContainer.scrollTo({ behavior: 'smooth', top: logContainer.scrollHeight });
    }
  }, [logs]);

  return (
    <TextField
      value={logs.join('\n')}
      multiline
      rows={28}
      slotProps={{ input: { readOnly: true } }}
      className="log-container"
      fullWidth
      variant="outlined"
      sx={{
        padding: '16px',
        borderRadius: '8px',
      }}
    />
  );
}