'use client';

import React from 'react';
import { Plus, Shield, X, ShieldAlert } from 'lucide-react';

export interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  onSelect: (type: string) => void;
  filter?: 'canvas' | 'contract' | 'invariant';
}

interface MenuOption {
  id: string;
  label: string;
  icon: any;
  allowedFrom: ('canvas' | 'contract' | 'invariant')[];
}

const OPTIONS: MenuOption[] = [
  {
    id: 'addNewContract',
    label: 'Add Contract',
    icon: Plus,
    allowedFrom: ['canvas']
  },
  {
    id: 'invariant',
    label: 'Add Invariant',
    icon: Shield,
    allowedFrom: ['canvas', 'contract']
  },
  {
    id: 'defenseAction',
    label: 'Add Defense Action',
    icon: ShieldAlert,
    allowedFrom: ['canvas', 'invariant']
  }
];

export function ContextMenu({ x, y, onClose, onSelect, filter = 'canvas' }: ContextMenuProps) {
  const filteredOptions = OPTIONS.filter(opt => opt.allowedFrom.includes(filter));

  return (
    <div
      className="fixed z-[1000] w-64 bg-[#1b1b1b]/95 backdrop-blur-md border border-white/10 shadow-2xl flex flex-col overflow-hidden"
      style={{ top: y, left: x }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/5">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#919191]">Options</span>
        <button 
          onClick={onClose} 
          className="text-[#919191] hover:text-white transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex flex-col">
        {filteredOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => {
              onSelect(option.id);
              onClose();
            }}
            className="flex items-center gap-4 px-4 py-5 hover:bg-white/5 transition-all group text-left"
          >
            <option.icon className="w-4 h-4 text-[#919191] group-hover:text-white group-hover:scale-110 transition-all" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#919191] group-hover:text-white">
              {option.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
