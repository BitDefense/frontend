'use client';

import React from 'react';
import { Cpu } from 'lucide-react';
import { Handle, Position } from '@xyflow/react';

export function ActionNode() {
  return (
    <div className="relative w-72 bg-[#1b1b1b]/90 backdrop-blur-md border border-white/10 shadow-2xl group rounded-none">
      <Handle 
        type="target" 
        position={Position.Left} 
        className="w-3 h-3 bg-[#131313] border border-white !rounded-none hover:bg-white hover:scale-150 transition-all left-[-6px]" 
      />
      <div className="bg-[#353535]/50 p-4 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-3">
          <Cpu className="w-4 h-4 text-white" />
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white">Execute Method</span>
        </div>
      </div>
      <div className="p-6">
        <div className="text-[10px] uppercase tracking-widest text-[#919191] border border-white/5 bg-black/40 p-4 text-center border-dashed">
          Awaiting Contract Input...
        </div>
      </div>
      <Handle 
        type="source" 
        position={Position.Right} 
        className="w-3 h-3 bg-[#131313] border border-white !rounded-none hover:bg-white hover:scale-150 transition-all right-[-6px]" 
      />
    </div>
  );
}
