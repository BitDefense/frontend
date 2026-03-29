'use client';

import React, { useState } from 'react';
import { Shield, ArrowLeft, ChevronRight } from 'lucide-react';
import { Handle, Position, useHandleConnections, useNodesData } from '@xyflow/react';

export type InvariantStep = 'SELECT_VAR' | 'VARIABLE_TYPE' | 'OPERATOR' | 'THRESHOLD' | 'SAVED';

export function InvariantNode() {
  const [step, setStep] = useState<InvariantStep>('SELECT_VAR');
  const [selectedVar, setSelectedVar] = useState<string | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [threshold, setThreshold] = useState<string | null>(null);

  const connections = useHandleConnections({
    type: 'target',
  });

  const sourceNodesData = useNodesData(connections.map((c) => c.source));

  // Extract variables from connected source nodes (e.g., AddNewContractNode)
  const availableVariables = sourceNodesData
    ?.flatMap((node) => (node?.data as any)?.variables || [])
    .filter((v, i, a) => a.indexOf(v) === i) || [];

  const renderSelectVar = () => (
    <div className="space-y-4">
      <div className="text-[10px] uppercase tracking-[0.2em] text-[#919191] mb-2 px-1">Select Variable</div>
      <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-2 scrollbar-hide">
        {availableVariables.length > 0 ? (
          availableVariables.map((v) => (
            <button
              key={v}
              onClick={() => {
                setSelectedVar(v);
                setStep('OPERATOR');
              }}
              className="flex items-center justify-between p-3 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group/item"
            >
              <span className="text-[11px] font-mono text-white truncate">{v}</span>
              <ChevronRight className="w-3 h-3 text-white/30 group-hover/item:text-white transition-colors" />
            </button>
          ))
        ) : (
          <div className="p-8 text-center border border-dashed border-white/10 bg-white/[0.02]">
            <p className="text-[10px] text-[#919191] uppercase tracking-widest leading-relaxed">
              No connected contract<br />detected
            </p>
          </div>
        )}
      </div>
    </div>
  );

  const renderSelectOperator = () => {
    const operators = ['>=', '<=', '==', '!=', '>', '<'];
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-[#919191] mb-2 px-1">
          <button 
            onClick={() => setStep('SELECT_VAR')}
            className="hover:text-white transition-colors p-1 -ml-1"
          >
            <ArrowLeft className="w-3 h-3" />
          </button>
          <span>Operator: {selectedVar}</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {operators.map((op) => (
            <button
              key={op}
              onClick={() => {
                setOperator(op);
                setStep('THRESHOLD');
              }}
              className="p-4 bg-white/5 border border-white/10 hover:bg-white/20 hover:border-white/40 transition-all text-white font-mono text-[14px] flex items-center justify-center aspect-square"
            >
              {op}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderThreshold = () => (
    <div className="space-y-4 text-center py-4">
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-[#919191] mb-4">
        <button 
          onClick={() => setStep('OPERATOR')}
          className="hover:text-white transition-colors p-1 -ml-1"
        >
          <ArrowLeft className="w-3 h-3" />
        </button>
        <span>Threshold: {selectedVar} {operator}</span>
      </div>
      <div className="text-[11px] text-[#919191] italic">Threshold implementation coming soon...</div>
      <button 
        onClick={() => setStep('SAVED')}
        className="w-full mt-4 bg-white text-black py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-neutral-200"
      >
        Complete Invariant
      </button>
    </div>
  );

  const renderSaved = () => (
    <div className="flex flex-col items-center justify-center py-4 text-center">
      <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center mb-3 border border-green-500/30">
        <Shield className="w-5 h-5 text-green-400" />
      </div>
      <div className="text-[11px] font-bold text-white uppercase tracking-widest mb-1">Invariant Active</div>
      <div className="text-[10px] font-mono text-[#919191] mb-4">
        {selectedVar} {operator} {threshold || '...'}
      </div>
      <button 
        onClick={() => setStep('SELECT_VAR')}
        className="text-[9px] uppercase tracking-widest text-[#919191] hover:text-white"
      >
        Edit Invariant
      </button>
    </div>
  );

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
        {step === 'SELECT_VAR' && renderSelectVar()}
        {step === 'OPERATOR' && renderSelectOperator()}
        {step === 'THRESHOLD' && renderThreshold()}
        {step === 'SAVED' && renderSaved()}
      </div>

      <Handle 
        type="source" 
        position={Position.Right} 
        className="w-3 h-3 bg-[#131313] border border-white !rounded-none hover:bg-white hover:scale-150 transition-all right-[-6px]" 
      />
    </div>
  );
}
