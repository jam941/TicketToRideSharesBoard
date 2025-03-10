'use client';

import React, { useState } from 'react';
import { useGame } from '@/context/GameContext';
import { ShareType } from '@/types/game';
import { ShareSelector } from './ShareSelector';
import { PlayerStats } from './PlayerStats';
import { GameInfo } from './GameInfo';

export function GameBoard() {
  const { gameState, playerId, leaveGame, addShare, removeShare, loading } = useGame();
  const [selectedShareId, setSelectedShareId] = useState<number | null>(null);
  const [selectedDummyPlayerId, setSelectedDummyPlayerId] = useState<string | null>(null);
  const [showDummySelection, setShowDummySelection] = useState(false);

  if (!gameState) return null;

  const { shares, playerShares, players } = gameState;
  
  const otherPlayers = players.filter(p => p.id !== playerId);
  
  const shareCountsByType = shares.map(share => {
    if(playerShares === undefined) return {
      ...share,
      remaining: share.max,
      claimed: 0
    }
    const claimed = playerShares.filter(ps => ps.shareId === share.id).length;
    return {
      ...share,
      remaining: share.max - claimed,
      claimed
    };
  });

  const currentPlayerShares = playerShares
    ? playerShares.filter(ps => ps.playerId === playerId)
      .map(ps => {
        const shareData = shares.find(s => s.id === ps.shareId);
        return {
          ...ps,
          label: shareData?.label || '',
          color: shareData?.color || ''
        };
      })
    : [];

  const otherPlayerStats = players.map(player => {
    if (player.id === playerId) return null;
    
    const count = playerShares
      ? playerShares.filter(ps => ps.playerId === player.id).length
      : 0;
      
    return {
      player,
      count
    };
  }).filter(Boolean);

  const handleShareClick = (shareId: number) => {
    if (loading) return;
    
    if (selectedShareId === null) {
      setSelectedShareId(shareId);
      
      if (players.length > 2) {
        setShowDummySelection(true);
      } else {
        addShare(shareId);
        setSelectedShareId(null);
      }
    } else {
      setSelectedShareId(null);
      setShowDummySelection(false);
    }
  };

  const handleDummyPlayerSelect = (dummyPlayerId: string) => {
    if (selectedShareId !== null) {
      addShare(selectedShareId, true, dummyPlayerId);
      setSelectedShareId(null);
      setSelectedDummyPlayerId(null);
      setShowDummySelection(false);
    }
  };

  const handleRemoveShare = (shareId: number, playerId: string) => {
    if (loading) return;
    removeShare(shareId, playerId);
  };

  const handleLeaveGame = () => {
    leaveGame();
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-bold">Ticket To Ride Shares</h2>
        <button
          onClick={handleLeaveGame}
          className="px-3 py-1 bg-red-500 text-white text-sm rounded-md hover:bg-red-600"
        >
          Leave Game
        </button>
      </div>
      
      {/* Game Info */}
      <GameInfo />
      
      {/* Share counters */}
      <div className="mb-6">
        <h3 className="text-md font-semibold mb-2">Available Shares</h3>
        <ShareSelector 
          shares={shareCountsByType}
          onShareSelect={handleShareClick}
          selectedShareId={selectedShareId}
          disabled={loading}
        />
      </div>
      
      {/* Player Statistics */}
      <div className="mb-6">
        <PlayerStats />
      </div>
      
      {/* Dummy player selection modal */}
      {showDummySelection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 max-w-xs w-full">
            <h3 className="text-md font-semibold mb-3">Select Player to Assign Share</h3>
            <div className="space-y-1 mb-3">
              {otherPlayers.map(player => (
                <button
                  key={player.id}
                  onClick={() => handleDummyPlayerSelect(player.id)}
                  className="w-full p-2 text-left rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
                >
                  {player.name}
                </button>
              ))}
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => {
                  setSelectedShareId(null);
                  setShowDummySelection(false);
                }}
                className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div>
        <h3 className="text-md font-semibold mb-2">Your Shares</h3>
        <div className="border rounded-lg p-3 dark:border-gray-700 mb-4">
          <h4 className="font-medium text-sm mb-2">
            {players.find(p => p.id === playerId)?.name || 'You'}
          </h4>
          {currentPlayerShares.length === 0 ? (
            <p className="text-xs text-gray-500 dark:text-gray-400">No shares yet</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {currentPlayerShares.map((share, index) => (
                <div 
                  key={`${share.shareId}-${index}`} 
                  className={`px-2 py-1 rounded-full text-xs flex items-center gap-1 ${share.color} text-white`}
                >
                  {share.label}
                  <button
                    onClick={() => handleRemoveShare(share.shareId, playerId!)}
                    className="ml-1 h-4 w-4 rounded-full bg-white bg-opacity-30 flex items-center justify-center hover:bg-opacity-40"
                    aria-label="Remove share"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {otherPlayerStats.length > 0 && (
          <>
            <h3 className="text-md font-semibold mb-2">Other Players</h3>
            <div className="space-y-3">
              {otherPlayerStats.map((stat: any) => (
                <div key={stat.player.id} className="border rounded-lg p-3 dark:border-gray-700">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium text-sm">{stat.player.name}</h4>
                    <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
                      {stat.count} shares
                    </span>
                  </div>
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full" 
                        style={{ width: `${Math.min(100, (stat.count / 20) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
