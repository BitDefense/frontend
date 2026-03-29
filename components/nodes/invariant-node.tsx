'use client';

import React from 'react';
import { Shield } from 'lucide-react';
import { Handle, Position, useHandleConnections, useNodesData } from '@xyflow/react';

export type InvariantStep = 'CONFIG' | 'VALIDATION';

export function InvariantNode() {
  const connections = useHandleConnections({
    type: 'target',
  });

  const sourceNodesData = useNodesData(connections.map((c) => c.source));

  // Extract variables from connected source nodes (e.g., AddNewContractNode)
  const availableVariables = sourceNodesData
    ?.flatMap((node) => (node?.data as any)?.variables || [])
    .filter((v, i, a) => a.indexOf(v) === i) || [];

  return (
    <div className="relative w-80 bg-[#1b1b1b]/90 backdrop-blur-md border border-white/10 shadow-2xl group rounded-none">
      <Handle 
        type="target" 
        position={Position.Left} 
        className="w-3 h-3 bg-[#131313] border border-white !rounded-none hover:bg-white hover:scale-150 transition-all left-[-6px]" 
      />
      
      <div className="bg-[#353535]/50 p-4 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-3">
          <Shield className="w-4 h-4 text-white" />
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white">Invariant Guard</span>
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          <div className="text-[10px] uppercase tracking-widest text-[#919191]">
            Connected Variables ({availableVariables.length})
          </div>
          {availableVariables.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {availableVariables.map((v: string) => (
                <div key={v} className="bg-white/5 border border-white/10 px-2 py-1 text-[9px] font-mono text-white">
                  {v}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-[10px] uppercase tracking-widest text-[#919191] border border-white/5 bg-black/40 p-4 text-center border-dashed">
              Awaiting Contract Connection...
            </div>
          )}
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
