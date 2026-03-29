# Invariant Node Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a new React Flow custom node `InvariantNode` that allows users to define security thresholds for storage variables discovered from a connected `AddNewContractNode`.

**Architecture:** 
- A custom React Flow node with an internal wizard state (`SELECT_VAR`, `VARIABLE_TYPE`, `OPERATOR`, `THRESHOLD`, `SAVED`).
- Uses `useHandleConnections` and `useNodesData` from `@xyflow/react` to reactively fetch variables from connected nodes.
- Follows the same visual pattern as `AddNewContractNode` (consistent header, handles, and styling).

**Tech Stack:** React, TypeScript, Tailwind CSS, Lucide React, @xyflow/react.

---

### Task 1: Scaffolding the InvariantNode Component

**Files:**
- Create: `components/nodes/invariant-node.tsx`
- Modify: `components/flow-canvas.tsx`

- [ ] **Step 1: Create the basic component structure**

```typescript
// components/nodes/invariant-node.tsx
'use client';

import React, { useState } from 'react';
import { Handle, Position, useHandleConnections, useNodesData } from '@xyflow/react';
import { Shield, ArrowLeft, Check, ChevronRight } from 'lucide-react';

export type InvariantStep = 'SELECT_VAR' | 'VARIABLE_TYPE' | 'OPERATOR' | 'THRESHOLD' | 'SAVED';

export function InvariantNode({ id }: { id: string }) {
  const [step, setStep] = useState<InvariantStep>('SELECT_VAR');
  const [data, setData] = useState({
    variableName: '',
    type: 'uint256',
    operator: '',
    threshold: ''
  });

  // Connection logic to find the connected contract node
  const connections = useHandleConnections({ type: 'target' });
  const sourceNodeData = useNodesData(connections[0]?.source);
  
  // Extract variables from the connected AddNewContractNode if it exists
  const availableVars = (sourceNodeData?.data as any)?.variables || [];

  return (
    <div className="relative w-80 bg-[#1b1b1b]/90 backdrop-blur-md border border-white/10 shadow-2xl rounded-none group">
      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-[#131313] border border-white !rounded-none left-[-6px]" />
      
      {/* Header */}
      <div className="bg-[#353535]/50 p-4 flex items-center border-b border-white/10">
        <div className="flex items-center gap-3">
          <Shield className="w-4 h-4 text-white" />
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white">Add Invariant</span>
        </div>
      </div>

      <div className="min-h-[120px]">
        {/* Wizard content will go here */}
      </div>

      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-[#131313] border border-white !rounded-none right-[-6px]" />
    </div>
  );
}
```

- [ ] **Step 2: Register the new node type in FlowCanvas**

```typescript
// components/flow-canvas.tsx
import { InvariantNode } from '@/components/nodes/invariant-node';
// ...
const nodeTypes = {
  addNewContract: AddNewContractNode,
  action: ActionNode,
  invariant: InvariantNode, // Add this
};
```

- [ ] **Step 3: Commit Scaffolding**

```bash
git add components/nodes/invariant-node.tsx components/flow-canvas.tsx
git commit -m "feat: scaffold InvariantNode and register in FlowCanvas"
```

---

### Task 2: Implement SELECT_VAR and OPERATOR Steps

**Files:**
- Modify: `components/nodes/invariant-node.tsx`

- [ ] **Step 1: Implement Variable Selection UI**

```typescript
// Inside InvariantNode.tsx
const renderSelectVar = () => (
  <div className="p-6 space-y-4">
    <div className="text-[10px] uppercase tracking-widest text-[#919191]">Select Variable</div>
    {availableVars.length > 0 ? (
      <div className="space-y-2 max-h-40 overflow-y-auto scrollbar-hide">
        {availableVars.map((v: string) => (
          <button 
            key={v}
            onClick={() => { setData({...data, variableName: v}); setStep('OPERATOR'); }}
            className="w-full text-left p-3 bg-white/5 border border-white/5 hover:bg-white/10 text-[11px] font-mono text-white flex items-center justify-between group"
          >
            {v}
            <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        ))}
      </div>
    ) : (
      <div className="p-4 border border-dashed border-white/10 text-[9px] text-[#919191] text-center uppercase tracking-widest leading-loose">
        Connect a Contract node <br/> to discover variables
      </div>
    )}
  </div>
);
```

- [ ] **Step 2: Implement Operator Selection UI**

```typescript
// Inside InvariantNode.tsx
const operators = ['>=', '<=', '==', '!=', '>', '<'];

const renderSelectOperator = () => (
  <div className="p-6 space-y-6">
    <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-[#919191]">
      <button onClick={() => setStep('SELECT_VAR')}><ArrowLeft className="w-3 h-3"/></button>
      Select Comparison
    </div>
    <div className="grid grid-cols-3 gap-2">
      {operators.map(op => (
        <button 
          key={op}
          onClick={() => { setData({...data, operator: op}); setStep('THRESHOLD'); }}
          className="p-3 bg-white/5 border border-white/10 hover:bg-white/10 text-[12px] font-mono text-white transition-colors"
        >
          {op}
        </button>
      ))}
    </div>
  </div>
);
```

- [ ] **Step 3: Commit Selection Steps**

```bash
git add components/nodes/invariant-node.tsx
git commit -m "feat: implement variable and operator selection in InvariantNode"
```

---

### Task 3: Implement THRESHOLD and SAVED Steps

**Files:**
- Modify: `components/nodes/invariant-node.tsx`

- [ ] **Step 1: Implement Threshold Input UI**

```typescript
// Inside InvariantNode.tsx
const renderSetThreshold = () => (
  <div className="p-6 space-y-6">
    <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-[#919191]">
      <button onClick={() => setStep('OPERATOR')}><ArrowLeft className="w-3 h-3"/></button>
      Set Threshold for {data.variableName}
    </div>
    <div className="space-y-4">
      <div className="flex items-center gap-3 bg-black/40 border border-white/5 p-3">
        <span className="text-[11px] font-mono text-white/50">{data.operator}</span>
        <input 
          autoFocus
          type="text"
          placeholder="Value (e.g. 1000000)"
          className="bg-transparent border-none p-0 text-[11px] font-mono text-white focus:outline-none w-full"
          value={data.threshold}
          onChange={(e) => setData({...data, threshold: e.target.value})}
        />
      </div>
      <button 
        disabled={!data.threshold}
        onClick={() => setStep('SAVED')}
        className="w-full bg-white text-black py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-neutral-200 disabled:opacity-50"
      >
        Finish Invariant
      </button>
    </div>
  </div>
);
```

- [ ] **Step 2: Implement Saved State UI**

```typescript
// Inside InvariantNode.tsx
const renderSaved = () => (
  <>
    <div className="bg-blue-500/10 p-4 border-b border-blue-500/20 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Check className="w-4 h-4 text-blue-400" />
        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white">Invariant Active</span>
      </div>
      <button onClick={() => setStep('SELECT_VAR')} className="text-[9px] text-[#919191] hover:text-white uppercase">Edit</button>
    </div>
    <div className="p-6">
      <div className="font-mono text-[12px] text-white flex items-center gap-3 mb-2">
        <span className="text-white/60">{data.variableName}</span>
        <span className="text-blue-400 font-bold">{data.operator}</span>
        <span className="text-white">{data.threshold}</span>
      </div>
      <div className="text-[9px] uppercase tracking-widest text-neutral-500">
        Type: {data.type}
      </div>
    </div>
  </>
);
```

- [ ] **Step 3: Update Main Rendering**

```typescript
// Inside InvariantNode.tsx return statement
<div className="min-h-[120px]">
  {step === 'SELECT_VAR' && renderSelectVar()}
  {step === 'OPERATOR' && renderSelectOperator()}
  {step === 'THRESHOLD' && renderSetThreshold()}
  {step === 'SAVED' && renderSaved()}
</div>
```

- [ ] **Step 4: Commit Final Steps**

```bash
git add components/nodes/invariant-node.tsx
git commit -m "feat: implement threshold input and saved state for InvariantNode"
```
