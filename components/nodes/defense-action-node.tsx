'use client';

import React, { useState, useEffect } from 'react';
import { ShieldAlert, ArrowLeft, ChevronRight, Zap } from 'lucide-react';
import { Handle, Position, useReactFlow } from '@xyflow/react';

export type DefenseStep = 'CONFIG' | 'SAVED';

export function DefenseActionNode({ id, data: initialData }: { id: string, data: any }) {
  const [step, setStep] = useState<DefenseStep>(initialData?.step || 'CONFIG');
  const [actionType, setActionType] = useState<string | null>(initialData?.actionType || null);
  const [params, setParams] = useState<Record<string, any>>(initialData?.params || {});

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
              actionType,
              params,
              step
            }
          };
        }
        return node;
      })
    );
  }, [id, actionType, params, step, setNodes]);

  const renderConfig = () => (
    <div className="p-6 space-y-4">
      <div className="text-[10px] uppercase tracking-[0.2em] text-[#919191] mb-2 px-1">Select Action</div>
      <div className="grid grid-cols-1 gap-2">
        <button
          onClick={() => {
            setActionType('PAUSE_CONTRACT');
            setStep('SAVED');
          }}
          className="flex items-center justify-between p-3 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group/item text-left"
        >
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-mono text-white">Pause Contract</span>
            <span className="text-[9px] text-[#919191] font-mono italic">Stops all transactions immediately</span>
          </div>
          <ChevronRight className="w-3 h-3 text-white/30 group-hover/item:text-white transition-colors" />
        </button>
        <button
          onClick={() => {
            setActionType('BLACKLIST_SENDER');
            setStep('SAVED');
          }}
          className="flex items-center justify-between p-3 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group/item text-left"
        >
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-mono text-white">Blacklist Sender</span>
            <span className="text-[9px] text-[#919191] font-mono italic">Block the offending address</span>
          </div>
          <ChevronRight className="w-3 h-3 text-white/30 group-hover/item:text-white transition-colors" />
        </button>
      </div>
    </div>
  );

  const renderSaved = () => (
    <>
      <div className="bg-red-500/10 p-4 border-b border-red-500/20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Zap className="w-4 h-4 text-red-400" />
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white">Action Armed</span>
        </div>
        <button
          onClick={() => setStep('CONFIG')}
          className="text-[9px] text-[#919191] hover:text-white uppercase tracking-[0.2em]"
        >
          Edit
        </button>
      </div>

      <div className="p-6">
        <div className="p-4 bg-white/5 border border-white/10 flex flex-col gap-2">
          <div className="text-[10px] uppercase tracking-[0.2em] text-[#919191]">Configured Action</div>
          <div className="text-[13px] font-mono text-white flex items-center gap-2">
            <span className="text-red-400">⚡</span>
            <span>{actionType?.replace('_', ' ')}</span>
          </div>
        </div>
      </div>
    </>
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
          <ShieldAlert className="w-4 h-4 text-red-500" />
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white">Defense Action</span>
        </div>
      </div>

      <div className="min-h-[100px]">
        {step === 'CONFIG' && renderConfig()}
        {step === 'SAVED' && renderSaved()}
      </div>
    </div>
  );
}
