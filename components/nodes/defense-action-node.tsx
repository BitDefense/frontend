'use client';

import React, { useState, useEffect } from 'react';
import { ShieldAlert, ArrowLeft, ChevronRight, Zap, MessageSquare, CircleSlash } from 'lucide-react';
import { Handle, Position, useReactFlow } from '@xyflow/react';

export type DefenseStep = 'SELECT_TYPE' | 'TELEGRAM_CONFIG' | 'PAUSE_ROLE' | 'PAUSE_FUNCTION' | 'SAVED';

export function DefenseActionNode({ id, data: initialData }: { id: string, data: any }) {
  const [step, setStep] = useState<DefenseStep>(initialData?.step || 'SELECT_TYPE');
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
            value={params.botToken || ''}
            onChange={(e) => setParams({ ...params, botToken: e.target.value })}
            placeholder="728471...:AAH_..."
            className="w-full bg-[#131313] border border-white/10 px-3 py-2 text-[11px] font-mono text-white focus:outline-none focus:border-red-500/50 transition-colors"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[9px] font-mono text-[#919191] uppercase px-1">Chat ID</label>
          <input
            type="text"
            value={params.chatId || ''}
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

  const renderPauseRole = () => (
    <div className="p-6 space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <button
          onClick={() => setStep('SELECT_TYPE')}
          className="text-[#919191] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
        </button>
        <div className="text-[10px] uppercase tracking-[0.2em] text-[#919191]">Emergency Role Holder</div>
      </div>

      <div className="space-y-3">
        <div className="space-y-1.5">
          <label className="text-[9px] font-mono text-[#919191] uppercase px-1">Role Address</label>
          <input
            type="text"
            value={params.roleAddress || ''}
            onChange={(e) => setParams({ ...params, roleAddress: e.target.value })}
            placeholder="0x..."
            className="w-full bg-[#131313] border border-white/10 px-3 py-2 text-[11px] font-mono text-white focus:outline-none focus:border-red-500/50 transition-colors"
          />
        </div>

        <button
          onClick={() => setStep('PAUSE_FUNCTION')}
          disabled={!params.roleAddress}
          className="w-full bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 py-2.5 transition-all group/next disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="flex items-center justify-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-400 group-hover/next:text-red-300">Next Step</span>
            <ChevronRight className="w-3 h-3 text-red-400 group-hover/next:text-red-300" />
          </div>
        </button>
      </div>
    </div>
  );

  const renderPauseFunction = () => (
    <div className="p-6 space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <button
          onClick={() => setStep('PAUSE_ROLE')}
          className="text-[#919191] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
        </button>
        <div className="text-[10px] uppercase tracking-[0.2em] text-[#919191]">Pause Function Details</div>
      </div>

      <div className="space-y-3">
        <div className="space-y-1.5">
          <label className="text-[9px] font-mono text-[#919191] uppercase px-1">Function Selector (4-byte hex)</label>
          <input
            type="text"
            value={params.functionHex || ''}
            onChange={(e) => setParams({ ...params, functionHex: e.target.value })}
            placeholder="0x8456..."
            className="w-full bg-[#131313] border border-white/10 px-3 py-2 text-[11px] font-mono text-white focus:outline-none focus:border-red-500/50 transition-colors"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[9px] font-mono text-[#919191] uppercase px-1">Arguments (comma separated)</label>
          <textarea
            value={params.args || ''}
            onChange={(e) => setParams({ ...params, args: e.target.value })}
            placeholder="arg1, arg2, ..."
            rows={2}
            className="w-full bg-[#131313] border border-white/10 px-3 py-2 text-[11px] font-mono text-white focus:outline-none focus:border-red-500/50 transition-colors resize-none"
          />
        </div>

        <button
          onClick={() => setStep('SAVED')}
          disabled={!params.functionHex}
          className="w-full bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 py-2.5 transition-all group/save disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-400 group-hover/save:text-red-300">Save Defense</span>
        </button>
      </div>
    </div>
  );

  const renderSaved = () => (
    <>
      <div className="bg-red-600 p-4 border-b border-red-500/20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Zap className="w-4 h-4 text-white animate-pulse" />
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white">Defense Active</span>
        </div>
        <button
          onClick={() => setStep('SELECT_TYPE')}
          className="text-[9px] text-white/70 hover:text-white uppercase tracking-[0.2em] underline underline-offset-4"
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
          
          <div className="mt-2 space-y-3 border-t border-white/5 pt-3">
            {actionType === 'TELEGRAM_ALERT' && (
              <div className="space-y-1">
                <div className="text-[9px] text-[#919191] uppercase tracking-[0.1em]">Target Chat ID</div>
                <div className="text-[10px] font-mono text-white truncate">{params.chatId}</div>
              </div>
            )}
            {actionType === 'PAUSE_AGENT' && (
              <>
                <div className="space-y-1">
                  <div className="text-[9px] text-[#919191] uppercase tracking-[0.1em]">Role Holder</div>
                  <div className="text-[10px] font-mono text-white truncate">{params.roleAddress}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-[9px] text-[#919191] uppercase tracking-[0.1em]">Function Selector</div>
                  <div className="text-[10px] font-mono text-white truncate">{params.functionHex}</div>
                </div>
              </>
            )}
          </div>
        </div>
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
            <ShieldAlert className="w-4 h-4 text-white" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white">ADD DEFENSE ACTION</span>
          </div>
        </div>
      )}

      <div className="min-h-[100px]">
        {step === 'SELECT_TYPE' && renderSelectType()}
        {step === 'TELEGRAM_CONFIG' && renderTelegramConfig()}
        {step === 'PAUSE_ROLE' && renderPauseRole()}
        {step === 'PAUSE_FUNCTION' && renderPauseFunction()}
        {step === 'SAVED' && renderSaved()}
      </div>
    </div>
  );
}
