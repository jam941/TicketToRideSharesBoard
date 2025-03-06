'use client';

import React, { useState } from 'react';
import { useGame } from '@/context/GameContext';

export function JoinGameForm() {
  const { playerName, setPlayerName, createGame, joinGame, loading, error } = useGame();
  const [gameId, setGameId] = useState('3733'); // Default to 3733
  const [formError, setFormError] = useState<string | null>(null);

  const handleCreateGame = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim()) {
      setFormError('Please enter your name');
      return;
    }
    
    setFormError(null);
    const createdGameId = await createGame();
    if (!createdGameId) {
      setFormError('Failed to create game. Please try again.');
    }
  };

  const handleJoinGame = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim()) {
      setFormError('Please enter your name');
      return;
    }
    
    if (!gameId.trim()) {
      setFormError('Please enter a game code');
      return;
    }
    
    setFormError(null);
    const joined = await joinGame(gameId);
    if (!joined) {
      setFormError('Failed to join game. Please check the game code and try again.');
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-center">Join or Create Game</h2>
      
      {(error || formError) && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md text-xs">
          {error || formError}
        </div>
      )}
      
      <form className="space-y-4">
        <div>
          <label htmlFor="playerName" className="block text-sm font-medium mb-1">
            Your Name
          </label>
          <input
            type="text"
            id="playerName"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
            placeholder="Enter your name"
            required
          />
        </div>
        
        <div>
          <label htmlFor="gameId" className="block text-sm font-medium mb-1">
            Game Code
          </label>
          <input
            type="text"
            id="gameId"
            value={gameId}
            onChange={(e) => setGameId(e.target.value)}
            className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
            placeholder="Enter game code (default: 3733)"
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Default game code: 3733
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
          <button
            type="button"
            onClick={handleJoinGame}
            disabled={loading}
            className="w-full px-4 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? 'Joining...' : 'Join Game'}
          </button>
          
          <button
            type="button"
            onClick={handleCreateGame}
            disabled={loading}
            className="w-full px-4 py-2 bg-green-500 text-white text-sm rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Game'}
          </button>
        </div>
      </form>
    </div>
  );
}
