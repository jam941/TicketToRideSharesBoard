'use client';

import React from 'react';
import { useGame } from '@/context/GameContext';

export function GameInfo() {
  const { gameState, playerId } = useGame();
  
  if (!gameState) return null;
  
  const { gameId, players, playerShares } = gameState;
  
  const hostPlayer = players.find(p => p.isHost);
  
  const totalShares = playerShares?.length || 0;
  
  const currentPlayer = players.find(p => p.id === playerId);
  
  return (
    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 mb-4">
      <div className="flex flex-wrap justify-between items-center gap-2">
        <div>
          <h3 className="text-sm font-semibold">Game #{gameId}</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Host: {hostPlayer?.name || 'Unknown'}
          </p>
        </div>
        
        <div className="text-right">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Players: {players.length}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Shares Claimed: {totalShares}
          </div>
        </div>
      </div>
      
      {currentPlayer && (
        <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs">
            You are playing as <span className="font-semibold">{currentPlayer.name}</span>
          </p>
        </div>
      )}
    </div>
  );
}
