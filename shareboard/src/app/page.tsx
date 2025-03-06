'use client';

import { useGame } from '@/context/GameContext';
import { JoinGameForm } from '@/components/JoinGameForm';
import { GameBoard } from '@/components/GameBoard';

export default function Home() {
  const { gameState } = useGame();
  
  return (
    <div className="min-h-screen p-4 sm:p-8 font-[family-name:var(--font-geist-sans)]">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Ticket To Ride Shares Board</h1>
        <p className="text-gray-600 dark:text-gray-400">Track your shares in real-time</p>
      </header>
      
      <main className="max-w-4xl mx-auto">
        {gameState ? <GameBoard /> : <JoinGameForm />}
      </main>
      
      <footer className="mt-16 text-center text-sm text-gray-500">
        <p>Ticket To Ride share tracker built with Next.js</p>
      </footer>
    </div>
  );
}
