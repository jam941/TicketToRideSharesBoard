export interface ShareType {
  id: number;
  label: string;
  color: string;
  max: number;
}

export interface Player {
  id: string;
  name: string;
  isHost: boolean;
}

export interface PlayerShare {
  playerId: string;
  shareId: number;
}

export interface GameState {
  gameId: string;
  players: Player[];
  shares: ShareType[];
  playerShares: PlayerShare[];
  active: boolean;
  createdAt: number;
}

export interface GameContextType {
  gameState: GameState | null;
  playerId: string | null;
  playerName: string;
  setPlayerName: (name: string) => void;
  loading: boolean;
  error: string | null;
  createGame: () => Promise<string | null>;
  joinGame: (gameId: string) => Promise<boolean>;
  leaveGame: () => void;
  addShare: (shareId: number, isDummy?: boolean, dummyPlayerId?: string) => void;
  removeShare: (shareId: number, playerId: string) => void;
}
