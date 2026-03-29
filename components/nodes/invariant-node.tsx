'use client';

import React from 'react';
import { Shield } from 'lucide-react';
import { Handle, Position, useHandleConnections, useNodesData } from '@xyflow/react';

export type InvariantStep = 'SELECT_VAR' | 'VARIABLE_TYPE' | 'OPERATOR' | 'THRESHOLD' | 'SAVED';

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
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white">ADD NEW INVARIANT</span>
        </div>
      </div>

      <div className="p-6 min-h-[120px]">
        {/* Wizard steps will be implemented here */}
      </div>

      <Handle 
        type="source" 
        position={Position.Right} 
        className="w-3 h-3 bg-[#131313] border border-white !rounded-none hover:bg-white hover:scale-150 transition-all right-[-6px]" 
      />
    </div>
  );
}
