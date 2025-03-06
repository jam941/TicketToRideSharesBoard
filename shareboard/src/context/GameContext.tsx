'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  ref, 
  set, 
  get, 
  onValue, 
  update, 
  push, 
  child, 
  remove 
} from 'firebase/database';
import { database } from '@/lib/firebase';
import { ShareType, PlayerShare, GameState, GameContextType, Player } from '@/types/game';

const defaultShares: ShareType[] = [
  { id: 1, label: 'New York Central System', max: 12, color: 'bg-red-500' },
  { id: 2, label: 'Jersey Central Line', max: 15, color: 'bg-blue-500' },
  { id: 3, label: 'Lackawanna Erie Railway', max: 10, color: 'bg-green-500' },
  { id: 4, label: 'Western Maryland Railway', max: 8, color: 'bg-yellow-500' },
  { id: 5, label: 'Lehigh Valley Railroad', max: 5, color: 'bg-purple-500' },
  { id: 6, label: 'Reading Railroad', max: 7, color: 'bg-orange-500' },
  { id: 7, label: 'BR & P', max: 10, color: 'bg-gray-200 dark:bg-gray-300 dark:border dark:border-gray-400' },
  //{ id: 8, label: 'Baltimore & Ohio Railroad', max: 6, color: 'bg-blue-500' },
 // { id: 9, label: 'Pennsylvania Railroad', max: 2, color: 'bg-brown-500' },
];

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [playerName, setPlayerName] = useState<string>('');
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [unsubscribe, setUnsubscribe] = useState<(() => void) | null>(null);

  useEffect(() => {
    const storedPlayerId = localStorage.getItem('playerId');
    if (storedPlayerId) {
      setPlayerId(storedPlayerId);
    } else {
      const newPlayerId = `player_${Math.random().toString(36).substring(2, 9)}`;
      localStorage.setItem('playerId', newPlayerId);
      setPlayerId(newPlayerId);
    }

    const storedPlayerName = localStorage.getItem('playerName');
    if (storedPlayerName) {
      setPlayerName(storedPlayerName);
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  useEffect(() => {
    if (playerName) {
      localStorage.setItem('playerName', playerName);
    }
  }, [playerName]);

  const createGame = async (): Promise<string | null> => {
    if (!playerName || !playerId) {
      setError('Please enter your name before creating a game');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const gameId = '3733';
      
      const gameRef = ref(database, `games/${gameId}`);
      const snapshot = await get(gameRef);
      
      if (snapshot.exists()) {
        const gameData = snapshot.val() as GameState;
        if (gameData.active) {
          setError('A game with this code already exists. Please join the game or try a different code.');
          setLoading(false);
          return null;
        }
      }
      
      const newGame: GameState = {
        gameId,
        players: [{
          id: playerId,
          name: playerName,
          isHost: true
        }],
        shares: defaultShares,
        playerShares: [],
        active: true,
        createdAt: Date.now()
      };

      await set(gameRef, newGame);
      
      const unsub = onValue(gameRef, (snapshot) => {
        if (snapshot.exists()) {
          setGameState(snapshot.val() as GameState);
        } else {
          setGameState(null);
        }
      });
      
      setUnsubscribe(() => unsub);
      setLoading(false);
      return gameId;
    } catch (err) {
      console.error('Error creating game:', err);
      setError('Failed to create game. Please try again.');
      setLoading(false);
      return null;
    }
  };

  const joinGame = async (gameId: string): Promise<boolean> => {
    if (!playerName || !playerId) {
      setError('Please enter your name before joining a game');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const gameRef = ref(database, `games/${gameId}`);
      const snapshot = await get(gameRef);

      if (!snapshot.exists()) {
        setError('Game not found. Please check the game code and try again.');
        setLoading(false);
        return false;
      }

      const gameData = snapshot.val() as GameState;
      
      if (!gameData.active) {
        setError('This game has ended.');
        setLoading(false);
        return false;
      }

      
      const existingPlayer = gameData.players.find(p => p.id === playerId);
      
      if (!existingPlayer) {
        const updatedPlayers = [...gameData.players, {
          id: playerId,
          name: playerName,
          isHost: false
        }];
        
        await update(gameRef, {
          players: updatedPlayers
        });
      }

      const unsub = onValue(gameRef, (snapshot) => {
        if (snapshot.exists()) {
          setGameState(snapshot.val() as GameState);
        } else {
          setGameState(null);
        }
      });
      
      setUnsubscribe(() => unsub);
      setLoading(false);
      return true;
    } catch (err) {
      console.error('Error joining game:', err);
      setError('Failed to join game. Please try again.');
      setLoading(false);
      return false;
    }
  };

  const leaveGame = () => {
    if (!gameState || !playerId) return;

    setLoading(true);
    setError(null);

    try {
      const gameRef = ref(database, `games/${gameState.gameId}`);

      const updatedPlayers = gameState.players.filter(p => p.id !== playerId);
      
      const updatedPlayerShares = gameState.playerShares.filter(ps => ps.playerId !== playerId);
      
      if (updatedPlayers.length === 0) {
        update(gameRef, {
          active: false
        });
      } else {
        update(gameRef, {
          players: updatedPlayers,
          playerShares: updatedPlayerShares
        });
      }

      if (unsubscribe) {
        unsubscribe();
        setUnsubscribe(null);
      }
      
      setGameState(null);
      setLoading(false);
    } catch (err) {
      console.error('Error leaving game:', err);
      setError('Failed to leave game. Please try again.');
      setLoading(false);
    }
  };

  const addShare = (shareId: number, isDummy = false, dummyPlayerId?: string) => {
    if (!gameState || !playerId) return;

    setLoading(true);
    setError(null);

    try {
      const gameRef = ref(database, `games/${gameState.gameId}`);
      
      const share = gameState.shares.find(s => s.id === shareId);
      if (!share) {
        setError('Share not found');
        setLoading(false);
        return;
      }
      
      const existingSharesCount = gameState.playerShares?.filter(ps => ps.shareId === shareId).length || 0;
      
      if (existingSharesCount >= share.max) {
        setError(`All ${share.label} shares have been claimed`);
        setLoading(false);
        return;
      }

      const newPlayerShare: PlayerShare = {
        playerId: isDummy && dummyPlayerId ? dummyPlayerId : playerId,
        shareId
      };

      const updatedPlayerShares = [...(gameState.playerShares || []), newPlayerShare];

      update(gameRef, {
        playerShares: updatedPlayerShares
      });

      setLoading(false);
    } catch (err) {
      console.error('Error adding share:', err);
      setError('Failed to add share. Please try again.');
      setLoading(false);
    }
  };

  const removeShare = (shareId: number, playerId: string) => {
    if (!gameState) return;

    setLoading(true);
    setError(null);

    try {
      const gameRef = ref(database, `games/${gameState.gameId}`);
      
      const shareToRemoveIndex = gameState.playerShares.findIndex(
        ps => ps.shareId === shareId && ps.playerId === playerId
      );
      
      if (shareToRemoveIndex === -1) {
        setError('Share not found');
        setLoading(false);
        return;
      }
      
      const updatedPlayerShares = [...gameState.playerShares];
      updatedPlayerShares.splice(shareToRemoveIndex, 1);
      
      update(gameRef, {
        playerShares: updatedPlayerShares
      });

      setLoading(false);
    } catch (err) {
      console.error('Error removing share:', err);
      setError('Failed to remove share. Please try again.');
      setLoading(false);
    }
  };

  const isHost = gameState?.players.some(p => p.id === playerId && p.isHost) || false;

  return (
    <GameContext.Provider
      value={{
        gameState,
        playerName,
        setPlayerName,
        playerId,
        createGame,
        joinGame,
        leaveGame,
        addShare,
        removeShare,
        loading,
        error
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
