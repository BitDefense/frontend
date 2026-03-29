# Add New Contract Node Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor the existing `ImportContractNode` into a sequential wizard called `AddNewContractNode` that supports source selection (Etherscan/File), automated variable parsing, and manual storage hash mapping.

**Architecture:** A custom React Flow node managing internal state for wizard steps (`SOURCE`, `INPUT`, `MAPPING`, `SAVED`). It uses a regex-based utility for parsing Solidity and hoists sub-step components for clarity.

**Tech Stack:** React, TypeScript, Tailwind CSS, Lucide React, @xyflow/react.

---

### Task 1: Solidity Parsing Utility

**Files:**
- Create: `lib/solidity-parser.ts`
- Create: `lib/__tests__/solidity-parser.test.ts`

- [ ] **Step 1: Write the failing test for variable extraction**

```typescript
// lib/__tests__/solidity-parser.test.ts
import { parseSolidityVariables } from '../solidity-parser';

describe('parseSolidityVariables', () => {
  it('extracts public uint256 variables', () => {
    const code = 'contract Example { public uint256 totalSupply; }';
    expect(parseSolidityVariables(code)).toEqual(['totalSupply']);
  });

  it('extracts multiple variables with different visibilities', () => {
    const code = `
      contract Example {
        uint256 private _secret;
        address public owner;
        mapping(address => uint256) balances;
      }
    `;
    expect(parseSolidityVariables(code)).toEqual(['_secret', 'owner', 'balances']);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test lib/__tests__/solidity-parser.test.ts`
Expected: FAIL (module not found)

- [ ] **Step 3: Implement the parsing utility**

```typescript
// lib/solidity-parser.ts
export function parseSolidityVariables(code: string): string[] {
  const variables: string[] = [];
  // Regex to match storage variable declarations: [type] [visibility?] [name];
  // Matches uint256, address, bool, mapping, and custom types
  const regex = /(?:uint\d*|address|bool|mapping\(.*?\)|bytes\d*|string)\s+(?:public|private|internal)?\s*(\w+)\s*;/g;
  
  let match;
  while ((match = regex.exec(code)) !== null) {
    variables.push(match[1]);
  }
  
  return variables;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test lib/__tests__/solidity-parser.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add lib/solidity-parser.ts lib/__tests__/solidity-parser.test.ts
git commit -m "feat: add solidity variable parsing utility"
```

---

### Task 2: Refactor Node Component Structure

**Files:**
- Rename: `components/nodes/import-contract-node.tsx` -> `components/nodes/add-new-contract-node.tsx`
- Modify: `components/flow-canvas.tsx`

- [ ] **Step 1: Rename the file and update internal types**

```typescript
// components/nodes/add-new-contract-node.tsx
'use client';

import React, { useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Network, Search, Upload, Check, X, ChevronDown, ArrowRight, ArrowLeft } from 'lucide-react';

export type WizardStep = 'SOURCE' | 'INPUT' | 'MAPPING' | 'SAVED';

export interface ContractData {
  address: string;
  network: string;
  source: 'etherscan' | 'file' | null;
  code: string;
  variables: string[];
  mappings: Record<string, string>;
}

export function AddNewContractNode() {
  const [step, setStep] = useState<WizardStep>('SOURCE');
  const [data, setData] = useState<ContractData>({
    address: '',
    network: 'ethereum',
    source: null,
    code: '',
    variables: [],
    mappings: {}
  });

  return (
    <div className="relative w-96 bg-[#1b1b1b]/90 backdrop-blur-md border border-white/10 shadow-2xl rounded-none overflow-hidden">
      {/* Step rendering will go here */}
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-[#131313] border border-white !rounded-none" />
    </div>
  );
}
```

- [ ] **Step 2: Update FlowCanvas to use the new node name**

```typescript
// components/flow-canvas.tsx
import { AddNewContractNode } from '@/components/nodes/add-new-contract-node';
// ...
const nodeTypes = {
  addNewContract: AddNewContractNode,
  action: ActionNode,
};

const initialNodes = [
  { id: 'node-1', type: 'addNewContract', position: { x: 100, y: 200 }, data: {} },
  // ...
];
```

- [ ] **Step 3: Commit refactor**

```bash
git rm components/nodes/import-contract-node.tsx
git add components/nodes/add-new-contract-node.tsx components/flow-canvas.tsx
git commit -m "refactor: rename ImportContractNode to AddNewContractNode and setup state"
```

---

### Task 3: Implement SOURCE and INPUT Steps

**Files:**
- Modify: `components/nodes/add-new-contract-node.tsx`

- [ ] **Step 1: Add Source Selection UI**

```typescript
// Inside AddNewContractNode
const renderSourceStep = () => (
  <div className="p-6 space-y-4">
    <div className="text-[10px] uppercase tracking-[0.2em] text-[#919191] mb-2">Select Source</div>
    <div className="grid grid-cols-2 gap-3">
      <button 
        onClick={() => { setData({...data, source: 'etherscan'}); setStep('INPUT'); }}
        className="flex flex-col items-center gap-3 p-6 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
      >
        <Search className="w-5 h-5 text-white" />
        <span className="text-[9px] font-mono uppercase tracking-widest text-white">Etherscan</span>
      </button>
      <button 
        onClick={() => { setData({...data, source: 'file'}); setStep('INPUT'); }}
        className="flex flex-col items-center gap-3 p-6 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
      >
        <Upload className="w-5 h-5 text-white" />
        <span className="text-[9px] font-mono uppercase tracking-widest text-white">Local File</span>
      </button>
    </div>
  </div>
);
```

- [ ] **Step 2: Add Input Form UI (Etherscan Simulator)**

```typescript
// Inside AddNewContractNode
const renderInputStep = () => {
  if (data.source === 'etherscan') {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-[#919191]">
          <button onClick={() => setStep('SOURCE')}><ArrowLeft className="w-3 h-3"/></button>
          Etherscan Details
        </div>
        <div className="space-y-4">
          <input 
            type="text"
            placeholder="Contract Address"
            className="w-full bg-black/40 border border-white/5 p-3 text-[11px] font-mono text-white focus:outline-none focus:border-white/20"
            value={data.address}
            onChange={(e) => setData({...data, address: e.target.value})}
          />
          <select 
            className="w-full bg-black/40 border border-white/5 p-3 text-[11px] font-mono text-white appearance-none"
            value={data.network}
            onChange={(e) => setData({...data, network: e.target.value})}
          >
            <option value="ethereum">Ethereum Mainnet</option>
          </select>
        </div>
        <button 
          onClick={() => {
            // Simulated fetch of Example contract
            const exampleCode = `contract Example { public uint256 totalSupply; constructor() { totalSupply = 1 ether; } }`;
            const vars = parseSolidityVariables(exampleCode);
            setData({...data, code: exampleCode, variables: vars});
            setStep('MAPPING');
          }}
          className="w-full bg-white text-black py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-neutral-200"
        >
          Download & Parse
        </button>
      </div>
    );
  }
  // File upload logic here...
};
```

- [ ] **Step 3: Commit UI steps**

```bash
git add components/nodes/add-new-contract-node.tsx
git commit -m "feat: implement source selection and etherscan input steps"
```

---

### Task 4: Implement MAPPING and SAVED Steps

**Files:**
- Modify: `components/nodes/add-new-contract-node.tsx`

- [ ] **Step 1: Add Variable Mapping UI**

```typescript
// Inside AddNewContractNode
const renderMappingStep = () => (
  <div className="p-6 space-y-6">
    <div className="text-[10px] uppercase tracking-widest text-[#919191]">Map Storage Variables</div>
    <div className="max-h-48 overflow-y-auto space-y-3 scrollbar-hide">
      {data.variables.map(v => (
        <div key={v} className="flex items-center gap-4 bg-black/20 p-3 border border-white/5">
          <div className="text-[10px] font-mono text-white flex-1 truncate">{v}</div>
          <input 
            placeholder="0x Hash"
            className="w-32 bg-black/60 border border-white/10 p-1.5 text-[9px] font-mono text-white focus:border-white/30 outline-none"
            value={data.mappings[v] || ''}
            onChange={(e) => setData({
              ...data, 
              mappings: {...data.mappings, [v]: e.target.value}
            })}
          />
        </div>
      ))}
    </div>
    <button 
      onClick={() => setStep('SAVED')}
      className="w-full bg-white text-black py-3 text-[10px] font-bold uppercase tracking-widest"
    >
      Save Contract
    </button>
  </div>
);
```

- [ ] **Step 2: Add Final Summary (Saved) UI**

```typescript
// Inside AddNewContractNode
const renderSavedStep = () => (
  <div className="bg-[#1b1b1b]">
    <div className="bg-green-500/10 p-4 border-b border-green-500/20 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Check className="w-4 h-4 text-green-400" />
        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white">Contract Added</span>
      </div>
      <button onClick={() => setStep('MAPPING')} className="text-[9px] text-[#919191] hover:text-white uppercase">Edit</button>
    </div>
    <div className="p-6">
      <div className="font-mono text-[11px] text-white/60 mb-1">{data.address.slice(0, 10)}...{data.address.slice(-8)}</div>
      <div className="text-[9px] uppercase tracking-widest text-neutral-500">
        {Object.keys(data.mappings).length} Variables Mapped
      </div>
    </div>
  </div>
);
```

- [ ] **Step 3: Commit final wizard steps**

```bash
git add components/nodes/add-new-contract-node.tsx
git commit -m "feat: implement mapping and summary steps for AddNewContractNode"
```
