'use client';

import React, { useState, useEffect } from 'react';
import { Shield, ArrowLeft, ChevronRight } from 'lucide-react';
import { Handle, Position, useHandleConnections, useNodesData, useReactFlow } from '@xyflow/react';

export type InvariantStep = 'SELECT_VAR' | 'VARIABLE_TYPE' | 'OPERATOR' | 'THRESHOLD' | 'SAVED';

export function InvariantNode({ id, data: initialData }: { id: string, data: any }) {
  const [step, setStep] = useState<InvariantStep>(initialData?.step || 'SELECT_VAR');
  const [selectedVar, setSelectedVar] = useState<string | null>(initialData?.selectedVar || null);
  const [selectedVarType, setSelectedVarType] = useState<string | null>(initialData?.selectedVarType || null);
  const [operator, setOperator] = useState<string | null>(initialData?.operator || null);
  const [threshold, setThreshold] = useState<string | null>(initialData?.threshold || null);

  const { setNodes } = useReactFlow();

  // Sync internal state back to React Flow node data
  useEffect(() => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              selectedVar,
              selectedVarType,
              operator,
              threshold,
              step
            }
          };
        }
        return node;
      })
    );
  }, [id, selectedVar, selectedVarType, operator, threshold, step, setNodes]);

  const connections = useHandleConnections({
    type: 'target',
  });

  const sourceNodesData = useNodesData(connections.map((c) => c.source));

  // Extract variables from connected source nodes (e.g., AddNewContractNode)
  const availableVariables = sourceNodesData
    ?.flatMap((node) => (node?.data as any)?.variables || [])
    .filter((v, i, a) => a.findIndex(t => t.name === v.name) === i) || [];

  const renderSelectVar = () => (
    <div className="p-6 space-y-4">
      <div className="text-[10px] uppercase tracking-[0.2em] text-[#919191] mb-2 px-1">Select Variable</div>
      <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-2 scrollbar-hide">
        {availableVariables.length > 0 ? (
          availableVariables.map((v) => (
            <button
              key={v.name}
              onClick={() => {
                setSelectedVar(v.name);
                setSelectedVarType(v.type);
                setStep('OPERATOR');
              }}
              className="flex items-center justify-between p-3 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group/item"
            >
              <div className="flex flex-col items-start gap-1">
                <span className="text-[11px] font-mono text-white truncate">{v.name}</span>
                <span className="text-[9px] text-[#919191] font-mono">{v.type}</span>
              </div>
              <ChevronRight className="w-3 h-3 text-white/30 group-hover/item:text-white transition-colors" />
            </button>
          ))
        ) : (
          <div className="p-8 text-center border border-dashed border-white/10 bg-white/[0.02]">
            <p className="text-[10px] text-[#919191] uppercase tracking-widest leading-relaxed">
              Connect a Contract node<br />to select variables.
            </p>
          </div>
        )}
      </div>
    </div>
  );

  const renderSelectOperator = () => {
    const operators = ['>=', '<=', '==', '!=', '>', '<'];
    return (
      <div className="p-6 space-y-4">
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-[#919191] mb-2 px-1">
          <button
            onClick={() => setStep('SELECT_VAR')}
            className="hover:text-white transition-colors p-1 -ml-1"
          >
            <ArrowLeft className="w-3 h-3" />
          </button>
          <span>Operator: {selectedVar} <span className="text-[9px] opacity-50">({selectedVarType})</span></span>
        </div>
        <div className="grid grid-cols-3 gap-2 px-1">
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

  const renderSetThreshold = () => (
    <div className="p-6 space-y-4">
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-[#919191] mb-4 px-1">
        <button
          onClick={() => setStep('OPERATOR')}
          className="hover:text-white transition-colors p-1 -ml-1"
        >
          <ArrowLeft className="w-3 h-3" />
        </button>
        <span>Set Threshold: {selectedVar}</span>
      </div>
      <div className="px-1 relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 font-mono text-[11px]">
          {operator}
        </div>
        <input
          type="text"
          placeholder="0.0"
          className="w-full bg-black/40 border border-white/10 p-3 pl-10 text-[11px] font-mono text-white focus:outline-none focus:border-white/30"
          value={threshold || ''}
          onChange={(e) => setThreshold(e.target.value)}
          autoFocus
        />
      </div>
      <button
        disabled={!threshold}
        onClick={() => setStep('SAVED')}
        className="w-full mt-4 bg-white text-black py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-neutral-200 disabled:opacity-50 transition-colors"
      >
        Finish
      </button>
    </div>
  );

  const renderSaved = () => (
    <>
      <div className="p-4 bg-blue-500/10 border-b border-blue-500/20 flex items-center gap-3">
        <Shield className="w-4 h-4 text-blue-400" />
        <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Invariant Active</span>
      </div>

      <div className="p-6">
        <div className="p-4 bg-white/5 border border-white/10 flex flex-col gap-2">
          <div className="text-[10px] uppercase tracking-widest text-[#919191]">Current Rule</div>
          <div className="text-[13px] font-mono text-white flex items-center gap-2 flex-wrap">
            <span className="text-blue-400">{selectedVar}</span>
            <span className="text-[#919191]">{operator}</span>
            <span className="text-white">{threshold}</span>
          </div>
        </div>

        <button
          onClick={() => {
            setStep('SELECT_VAR');
            setThreshold(null);
          }}
          className="w-full mt-6 flex items-center justify-center gap-2 py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-[10px] font-bold uppercase tracking-widest text-white transition-all"
        >
          Edit Invariant
        </button>
      </div>
    </>
  );

  return (
    <div className="relative w-96 bg-[#1b1b1b]/90 backdrop-blur-md border border-white/10 shadow-2xl group rounded-none">
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-[#131313] border border-white !rounded-none hover:bg-white hover:scale-150 transition-all left-[-6px]"
      />

      {step !== 'SAVED' && (
        <div className="bg-[#353535]/50 p-4 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <Shield className="w-4 h-4 text-white" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white">ADD INVARIANT</span>
          </div>
        </div>
      )}

      <div className="min-h-[120px]">
        {step === 'SELECT_VAR' && renderSelectVar()}
        {step === 'OPERATOR' && renderSelectOperator()}
        {step === 'THRESHOLD' && renderSetThreshold()}
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
