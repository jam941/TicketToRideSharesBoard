'use client';
import React from 'react';
interface CardCounterProps {
  current: number;
  max: number;
  label: string;
  color: string;
}

export function CardCounter({ current, max, label, color }: CardCounterProps) {
  
  const percentRemaining = (current / max) * 100;
  
  const boxes = Array.from({ length: max }, (_, i) => {
    const isActive = i < current;
    return (
      <div 
        key={i}
        className={`h-4 w-4 rounded-sm transition-colors ${isActive ? color : 'bg-gray-200 dark:bg-gray-700'}`}
        aria-hidden="true"
      />
    );
  });

  return (
    <div className="flex flex-col space-y-2 p-4 border rounded-lg shadow-sm">
      <div className="flex justify-between items-center">
        <h3 className="font-medium text-sm">{label}</h3>
        <span className="text-sm font-mono">
          {current}/{max}
        </span>
      </div>
      <div className="flex flex-wrap gap-1">
        {boxes}
      </div>
    </div>
  );
}
