export interface PlayerProps {
  playerName: string;
  playerIndex: number;
  cash: number;
  playerStocks: number[];
  isActive: boolean;
  isLocal: boolean;
  hotels: Array<{ hotelName: string }>;
}

export const Player = ({ cash, isLocal, isActive, playerName, playerStocks, hotels, playerIndex }: PlayerProps) => {
  return (
    <div className={"player-card common-bordered common-padded"
      + (isLocal ? ' local-player' : '')
      + (isActive ? ' active-player' : '')
    }>
      <div className="player-header">
        <span style={{ fontWeight: isLocal ? 'bold' : 'inherit' }}>{playerName + (isLocal ? ' (You)' : '')}</span>
        <span>${cash}</span>
      </div>
      <ul className="player-card-extended">
        {hotels.map((h, hi) => (
          <li key={playerIndex + '-' + h.hotelName} className='player-card-extended-stock'>
            <div>{h.hotelName[0]}</div>
            <div>{isLocal ? (playerStocks[hi]) : (playerStocks[hi] ? '?' : 0)}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

