'use client';

import React from 'react';
import { useGame } from '@/context/GameContext';
import { ShareType } from '@/types/game';

export function PlayerStats() {
  const { gameState, playerId } = useGame();
  
  if (!gameState) return null;
  
  const { players, playerShares, shares } = gameState;
  
  const playerStats = players.map(player => {
    const playerSharesData = playerShares?.filter(ps => ps.playerId === player.id);
    
    const sharesByType = shares.map(share => {
      const count = playerSharesData?.filter(ps => ps.shareId === share.id).length;
      return {
        ...share,
        count
      };
    }).filter(s => s.count > 0);
    
    const totalShares = playerSharesData?.length || 0;
    
    return {
      player,
      sharesByType,
      totalShares,
      isCurrentPlayer: player.id === playerId
    };
  });
  
  return (
    <div className="w-full">
      <h3 className="text-md font-semibold mb-2">Player Statistics</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {playerStats.map(({ player, sharesByType, totalShares, isCurrentPlayer }) => (
          <div 
            key={player.id} 
            className={`border rounded-lg p-3 ${
              isCurrentPlayer ? 'border-blue-500 dark:border-blue-500' : 'dark:border-gray-700'
            }`}
          >
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium text-sm">
                {player.name} {isCurrentPlayer && '(You)'}
              </h4>
              <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
                {totalShares} shares
              </span>
            </div>
            
            {isCurrentPlayer ? (
              sharesByType.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {sharesByType.map(share => (
                    <div 
                      key={share.id}
                      className={`px-2 py-0.5 rounded-full text-xs flex items-center ${share.color} text-white`}
                    >
                      {share.label} ({share.count})
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-500 dark:text-gray-400">No shares yet</p>
              )
            ) : (
              <div className="flex items-center">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{ width: `${Math.min(100, (totalShares / 20) * 100)}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
