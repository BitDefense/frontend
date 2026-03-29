# Defense Action Node Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a terminal React Flow custom node `DefenseActionNode` with a branching wizard flow for Telegram Alerts and Pause Agent actions.

**Architecture:** 
- A custom React Flow node with a multi-path wizard state (`SELECT_TYPE`, `TELEGRAM_CONFIG`, `PAUSE_ROLE`, `PAUSE_FUNCTION`, `SAVED`).
- Terminal node design: Left input port only, no output port.
- Synchronized with established node patterns (w-96, persistent header, success banners).

**Tech Stack:** React, TypeScript, Tailwind CSS, Lucide React, @xyflow/react.

---

### Task 1: Scaffolding and Context Menu Integration

**Files:**
- Create: `components/nodes/defense-action-node.tsx`
- Modify: `components/flow/context-menu.tsx`
- Modify: `components/flow-canvas.tsx`

- [ ] **Step 1: Create the basic DefenseActionNode structure**

```typescript
// components/nodes/defense-action-node.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Handle, Position, useReactFlow } from '@xyflow/react';
import { ShieldAlert, ArrowLeft, Check, MessageSquare, CircleSlash } from 'lucide-react';

export type DefenseStep = 'SELECT_TYPE' | 'TELEGRAM_CONFIG' | 'PAUSE_ROLE' | 'PAUSE_FUNCTION' | 'SAVED';

export function DefenseActionNode({ id, data: initialData }: { id: string, data: any }) {
  const [step, setStep] = useState<DefenseStep>('SELECT_TYPE');
  const { setNodes } = useReactFlow();
  const [data, setData] = useState({
    type: initialData?.type || null,
    telegram: initialData?.telegram || { botToken: '', chatId: '' },
    pause: initialData?.pause || { roleAddress: '', functionHex: '', args: '' }
  });

  useEffect(() => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === id) return { ...node, data: { ...node.data, ...data } };
        return node;
      })
    );
  }, [data, id, setNodes]);

  return (
    <div className="relative w-96 bg-[#1b1b1b]/90 backdrop-blur-md border border-white/10 shadow-2xl rounded-none group">
      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-[#131313] border border-white !rounded-none hover:bg-white hover:scale-150 transition-all left-[-6px]" />
      
      {step !== 'SAVED' && (
        <div className="bg-[#353535]/50 p-4 flex items-center border-b border-white/10">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-4 h-4 text-white" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white">Add Defense Action</span>
          </div>
        </div>
      )}

      <div className="min-h-[120px]">
        {/* Wizard steps */}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Update Context Menu Options**

```typescript
// components/flow/context-menu.tsx
import { Plus, Shield, ShieldAlert, X } from 'lucide-react'; // Added ShieldAlert

const OPTIONS: MenuOption[] = [
  // ...
  {
    id: 'defenseAction',
    label: 'Add Defense Action',
    icon: ShieldAlert,
    allowedFrom: ['canvas', 'invariant'] // Assuming 'invariant' filter is used for connections from Invariants
  }
];
```

- [ ] **Step 3: Register in FlowCanvas**

```typescript
// components/flow-canvas.tsx
import { DefenseActionNode } from '@/components/nodes/defense-action-node';
const nodeTypes = {
  // ...
  defenseAction: DefenseActionNode,
};
```

- [ ] **Step 4: Commit Scaffolding**

```bash
git add components/nodes/defense-action-node.tsx components/flow/context-menu.tsx components/flow-canvas.tsx
git commit -m "feat: scaffold DefenseActionNode and register in flow"
```

---

### Task 2: Implement Path Selection and Telegram Flow

**Files:**
- Modify: `components/nodes/defense-action-node.tsx`

- [ ] **Step 1: Implement SELECT_TYPE UI**

```typescript
// Inside DefenseActionNode
const renderSelectType = () => (
  <div className="p-6 space-y-4">
    <div className="text-[10px] uppercase tracking-[0.2em] text-[#919191] mb-2 px-1">Choose Defense Type</div>
    <div className="grid grid-cols-2 gap-3">
      <button 
        onClick={() => { setData(prev => ({...prev, type: 'telegram'})); setStep('TELEGRAM_CONFIG'); }}
        className="flex flex-col items-center gap-3 p-6 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors w-full"
      >
        <MessageSquare className="w-5 h-5 text-white" />
        <span className="text-[9px] font-mono uppercase tracking-widest text-white">Telegram Alert</span>
      </button>
      <button 
        onClick={() => { setData(prev => ({...prev, type: 'pause'})); setStep('PAUSE_ROLE'); }}
        className="flex flex-col items-center gap-3 p-6 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors w-full"
      >
        <CircleSlash className="w-5 h-5 text-white" />
        <span className="text-[9px] font-mono uppercase tracking-widest text-white">Pause Agent</span>
      </button>
    </div>
  </div>
);
```

- [ ] **Step 2: Implement TELEGRAM_CONFIG UI**

```typescript
// Inside DefenseActionNode
const renderTelegramConfig = () => (
  <div className="p-6 space-y-6">
    <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#919191]">
      <button onClick={() => setStep('SELECT_TYPE')}><ArrowLeft className="w-3 h-3"/></button>
      Connect Telegram Bot
    </div>
    <div className="space-y-4">
      <input 
        type="text"
        placeholder="Bot Token"
        className="w-full bg-black/40 border border-white/5 p-3 text-[11px] font-mono text-white focus:outline-none focus:border-white/20"
        value={data.telegram.botToken}
        onChange={(e) => setData(prev => ({...prev, telegram: {...prev.telegram, botToken: e.target.value}}))}
      />
      <input 
        type="text"
        placeholder="Chat ID"
        className="w-full bg-black/40 border border-white/5 p-3 text-[11px] font-mono text-white focus:outline-none focus:border-white/20"
        value={data.telegram.chatId}
        onChange={(e) => setData(prev => ({...prev, telegram: {...prev.telegram, chatId: e.target.value}}))}
      />
    </div>
    <button 
      disabled={!data.telegram.botToken || !data.telegram.chatId}
      onClick={() => setStep('SAVED')}
      className="w-full bg-white text-black py-3 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-neutral-200 disabled:opacity-50"
    >
      Save Alert
    </button>
  </div>
);
```

- [ ] **Step 3: Commit Telegram Path**

```bash
git add components/nodes/defense-action-node.tsx
git commit -m "feat: implement path selection and telegram alert flow in DefenseActionNode"
```

---

### Task 3: Implement Pause Path and Saved State

**Files:**
- Modify: `components/nodes/defense-action-node.tsx`

- [ ] **Step 1: Implement PAUSE_ROLE and PAUSE_FUNCTION UIs**

```typescript
// Inside DefenseActionNode
const renderPauseRole = () => (
  <div className="p-6 space-y-6">
    <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#919191]">
      <button onClick={() => setStep('SELECT_TYPE')}><ArrowLeft className="w-3 h-3"/></button>
      Grant Emergency Role
    </div>
    <input 
      placeholder="Role Holder Address (0x...)"
      className="w-full bg-black/40 border border-white/5 p-3 text-[11px] font-mono text-white focus:outline-none focus:border-white/20"
      value={data.pause.roleAddress}
      onChange={(e) => setData(prev => ({...prev, pause: {...prev.pause, roleAddress: e.target.value}}))}
    />
    <button 
      disabled={!data.pause.roleAddress}
      onClick={() => setStep('PAUSE_FUNCTION')}
      className="w-full bg-white text-black py-3 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-neutral-200 disabled:opacity-50"
    >
      Next: Setup Call
    </button>
  </div>
);

const renderPauseFunction = () => (
  <div className="p-6 space-y-6">
    <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#919191]">
      <button onClick={() => setStep('PAUSE_ROLE')}><ArrowLeft className="w-3 h-3"/></button>
      Setup Call Function
    </div>
    <div className="space-y-4">
      <input 
        placeholder="4-byte Hex (e.g. 0xdec0ffee)"
        className="w-full bg-black/40 border border-white/5 p-3 text-[11px] font-mono text-white focus:outline-none focus:border-white/20"
        value={data.pause.functionHex}
        onChange={(e) => setData(prev => ({...prev, pause: {...prev.pause, functionHex: e.target.value}}))}
      />
      <textarea 
        placeholder="Arguments (comma separated)"
        className="w-full bg-black/40 border border-white/5 p-3 text-[11px] font-mono text-white focus:outline-none focus:border-white/20 min-h-[80px]"
        value={data.pause.args}
        onChange={(e) => setData(prev => ({...prev, pause: {...prev.pause, args: e.target.value}}))}
      />
    </div>
    <button 
      disabled={!data.pause.functionHex}
      onClick={() => setStep('SAVED')}
      className="w-full bg-white text-black py-3 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-neutral-200 disabled:opacity-50"
    >
      Save Defense
    </button>
  </div>
);
```

- [ ] **Step 2: Implement SAVED State UI**

```typescript
// Inside DefenseActionNode
const renderSaved = () => (
  <>
    <div className="bg-red-500/10 p-4 border-b border-red-500/20 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Check className="w-4 h-4 text-red-400" />
        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white">Defense Active</span>
      </div>
      <button onClick={() => setStep('SELECT_TYPE')} className="text-[9px] text-[#919191] hover:text-white uppercase transition-colors">Edit</button>
    </div>
    <div className="p-6">
      <div className="p-4 bg-white/5 border border-white/10 flex flex-col gap-2">
        <div className="text-[10px] uppercase tracking-[0.2em] text-[#919191]">
          {data.type === 'telegram' ? 'Notification Alert' : 'On-Chain Pause'}
        </div>
        <div className="font-mono text-[11px] text-white/60">
          {data.type === 'telegram' 
            ? `Telegram: ${data.telegram.chatId}` 
            : `Call: ${data.pause.functionHex}`}
        </div>
      </div>
    </div>
  </>
);
```

- [ ] **Step 3: Update Main Render Loop**

```typescript
// Inside DefenseActionNode JSX
<div className="min-h-[120px]">
  {step === 'SELECT_TYPE' && renderSelectType()}
  {step === 'TELEGRAM_CONFIG' && renderTelegramConfig()}
  {step === 'PAUSE_ROLE' && renderPauseRole()}
  {step === 'PAUSE_FUNCTION' && renderPauseFunction()}
  {step === 'SAVED' && renderSaved()}
</div>
```

- [ ] **Step 4: Commit Final Steps**

```bash
git add components/nodes/defense-action-node.tsx
git commit -m "feat: implement pause flow and saved state for DefenseActionNode"
```
