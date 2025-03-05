'use client';

import { useState } from 'react';
import { CardCounter } from './ui/card-counter';

// Define the card types with their maximum values
const cardTypes = [
  { id: 1, label: 'Red', max: 12, color: 'bg-red-500' },
  { id: 2, label: 'Blue', max: 15, color: 'bg-blue-500' },
  { id: 3, label: 'Green', max: 10, color: 'bg-green-500' },
  { id: 4, label: 'Yellow', max: 8, color: 'bg-yellow-500' },
  { id: 5, label: 'Purple', max: 5, color: 'bg-purple-500' },
  { id: 6, label: 'Orange', max: 7, color: 'bg-orange-500' },
  { id: 7, label: 'Black', max: 10, color: 'bg-black' },
  { id: 8, label: 'White', max: 6, color: 'bg-gray-200 dark:bg-gray-300 dark:border dark:border-gray-400' },
  { id: 9, label: 'Wild', max: 2, color: 'bg-pink-500' },
];

export function CardCounterGrid() {
  const [counters, setCounters] = useState(
    cardTypes.map(card => ({ ...card, current: card.max }))
  );

  const incrementCounter = (id: number) => {
    setCounters(prev => 
      prev.map(counter => 
        counter.id === id && counter.current < counter.max 
          ? { ...counter, current: counter.current + 1 } 
          : counter
      )
    );
  };

  const decrementCounter = (id: number) => {
    setCounters(prev => 
      prev.map(counter => 
        counter.id === id && counter.current > 0 
          ? { ...counter, current: counter.current - 1 } 
          : counter
      )
    );
  };

  const resetCounters = () => {
    setCounters(cardTypes.map(card => ({ ...card, current: card.max })));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {counters.map(counter => (
          <div key={counter.id} className="flex flex-col">
            <CardCounter
              current={counter.current}
              max={counter.max}
              label={counter.label}
              color={counter.color}
            />
            <div className="flex justify-between mt-2">
              <button
                onClick={() => decrementCounter(counter.id)}
                className="px-3 py-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded text-sm"
                disabled={counter.current === 0}
              >
                -
              </button>
              <button
                onClick={() => incrementCounter(counter.id)}
                className="px-3 py-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded text-sm"
                disabled={counter.current === counter.max}
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center">
        <button
          onClick={resetCounters}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
        >
          Reset All
        </button>
      </div>
    </div>
  );
}
