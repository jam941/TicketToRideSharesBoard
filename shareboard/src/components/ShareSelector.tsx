'use client';

import React from 'react';
import { ShareType } from '@/types/game';

type ShareWithStats = ShareType & {
  remaining: number;
  claimed: number;
};

interface ShareSelectorProps {
  shares: ShareWithStats[];
  onShareSelect: (shareId: number) => void;
  selectedShareId: number | null;
  disabled?: boolean;
}

export function ShareSelector({ shares, onShareSelect, selectedShareId, disabled = false }: ShareSelectorProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
      {shares.map((share) => {
        const isSelected = selectedShareId === share.id;
        const isDisabled = share.remaining <= 0 || disabled;
        
        return (
          <button
            key={share.id}
            onClick={() => !isDisabled && onShareSelect(share.id)}
            disabled={isDisabled}
            className={`
              relative p-3 rounded-lg transition-all
              ${isSelected ? 'ring-2 ring-blue-500 dark:ring-blue-400' : ''}
              ${isDisabled 
                ? 'bg-gray-100 dark:bg-gray-800 cursor-not-allowed opacity-60' 
                : `${share.color} hover:brightness-110 active:brightness-90 cursor-pointer`
              }
            `}
          >
            <div className="flex flex-col items-center">
              <span className={`text-sm font-medium ${isDisabled ? 'text-gray-500 dark:text-gray-400' : 'text-white'}`}>
                {share.label}
              </span>
              <div className={`text-xs mt-1 ${isDisabled ? 'text-gray-500 dark:text-gray-400' : 'text-white text-opacity-90'}`}>
                {share.remaining} / {share.max}
              </div>
              
              {/* Progress bar */}
              <div className="w-full h-1.5 bg-black bg-opacity-20 rounded-full mt-2 overflow-hidden">
                <div 
                  className="h-full bg-white bg-opacity-30"
                  style={{ width: `${(share.claimed / share.max) * 100}%` }}
                ></div>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
