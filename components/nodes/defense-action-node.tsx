'use client';

import React, { useState, useEffect } from 'react';
import { ShieldAlert, ArrowLeft, ChevronRight, Zap, MessageSquare, CircleSlash } from 'lucide-react';
import { Handle, Position, useReactFlow } from '@xyflow/react';

export type DefenseStep = 'SELECT_TYPE' | 'TELEGRAM_CONFIG' | 'PAUSE_ROLE' | 'PAUSE_FUNCTION' | 'SAVED';

export function DefenseActionNode({ id, data: initialData }: { id: string, data: any }) {
  const [step, setStep] = useState<DefenseStep>(initialData?.step || 'SELECT_TYPE');
  const [actionType, setActionType] = useState<string | null>(initialData?.actionType || null);
  const [params, setParams] = useState<Record<string, any>>(initialData?.params || {
    botToken: '',
    chatId: ''
  });

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

  const renderSelectType = () => (
    <div className="p-6 space-y-4">
      <div className="text-[10px] uppercase tracking-[0.2em] text-[#919191] mb-2 px-1">Select Action Type</div>
      <div className="grid grid-cols-1 gap-2">
        <button
          onClick={() => {
            setActionType('TELEGRAM_ALERT');
            setStep('TELEGRAM_CONFIG');
          }}
          className="flex items-center justify-between p-3 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group/item text-left"
        >
          <div className="flex items-center gap-3">
            <MessageSquare className="w-4 h-4 text-[#919191] group-hover/item:text-white transition-colors" />
            <div className="flex flex-col gap-0.5">
              <span className="text-[11px] font-mono text-white">Telegram Alert</span>
              <span className="text-[9px] text-[#919191] font-mono italic leading-none">Get instant notifications</span>
            </div>
          </div>
          <ChevronRight className="w-3 h-3 text-white/30 group-hover/item:text-white transition-colors" />
        </button>

        <button
          onClick={() => {
            setActionType('PAUSE_AGENT');
            setStep('PAUSE_ROLE');
          }}
          className="flex items-center justify-between p-3 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group/item text-left"
        >
          <div className="flex items-center gap-3">
            <CircleSlash className="w-4 h-4 text-[#919191] group-hover/item:text-white transition-colors" />
            <div className="flex flex-col gap-0.5">
              <span className="text-[11px] font-mono text-white">Pause Agent</span>
              <span className="text-[9px] text-[#919191] font-mono italic leading-none">Stop specific agent operations</span>
            </div>
          </div>
          <ChevronRight className="w-3 h-3 text-white/30 group-hover/item:text-white transition-colors" />
        </button>
      </div>
    </div>
  );

  const renderTelegramConfig = () => (
    <div className="p-6 space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <button
          onClick={() => setStep('SELECT_TYPE')}
          className="text-[#919191] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
        </button>
        <div className="text-[10px] uppercase tracking-[0.2em] text-[#919191]">Telegram Bot Config</div>
      </div>

      <div className="space-y-3">
        <div className="space-y-1.5">
          <label className="text-[9px] font-mono text-[#919191] uppercase px-1">Bot Token</label>
          <input
            type="text"
            value={params.botToken}
            onChange={(e) => setParams({ ...params, botToken: e.target.value })}
            placeholder="728471...:AAH_..."
            className="w-full bg-[#131313] border border-white/10 px-3 py-2 text-[11px] font-mono text-white focus:outline-none focus:border-red-500/50 transition-colors"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[9px] font-mono text-[#919191] uppercase px-1">Chat ID</label>
          <input
            type="text"
            value={params.chatId}
            onChange={(e) => setParams({ ...params, chatId: e.target.value })}
            placeholder="-100123456789"
            className="w-full bg-[#131313] border border-white/10 px-3 py-2 text-[11px] font-mono text-white focus:outline-none focus:border-red-500/50 transition-colors"
          />
        </div>

        <button
          onClick={() => setStep('SAVED')}
          disabled={!params.botToken || !params.chatId}
          className="w-full bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 py-2.5 transition-all group/save disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-400 group-hover/save:text-red-300">Save Alert</span>
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
          onClick={() => setStep('SELECT_TYPE')}
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
          {actionType === 'TELEGRAM_ALERT' && (
            <div className="mt-2 space-y-1 border-t border-white/5 pt-2">
              <div className="text-[9px] text-[#919191] uppercase tracking-[0.1em]">Target Chat ID</div>
              <div className="text-[10px] font-mono text-white truncate">{params.chatId}</div>
            </div>
          )}
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
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white">ADD DEFENSE ACTION</span>
        </div>
      </div>

      <div className="min-h-[100px]">
        {step === 'SELECT_TYPE' && renderSelectType()}
        {step === 'TELEGRAM_CONFIG' && renderTelegramConfig()}
        {(step === 'PAUSE_ROLE' || step === 'PAUSE_FUNCTION') && (
          <div className="p-8 text-center text-[11px] font-mono text-[#919191]">
            Coming soon: {step.replace('_', ' ')} flow
          </div>
        )}
        {step === 'SAVED' && renderSaved()}
      </div>
    </div>
  );
}
