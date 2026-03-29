# Add New Contract Node Header & DnD Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a persistent "ADD NEW CONTRACT" header and implement functional drag-and-drop for `.sol` files in the `AddNewContractNode`.

**Architecture:** 
- Add a persistent header div to the top of the node's main container.
- Update the internal state of `AddNewContractNode` to track `isDragging`.
- Replace the static "File Upload" placeholder with a functional drop zone that uses `FileReader` and the existing `parseSolidityVariables` utility.

**Tech Stack:** React, TypeScript, Tailwind CSS, Lucide React, @xyflow/react.

---

### Task 1: Add Persistent Header

**Files:**
- Modify: `components/nodes/add-new-contract-node.tsx`

- [ ] **Step 1: Update Imports**
Add `Plus` to the `lucide-react` imports.

```typescript
// components/nodes/add-new-contract-node.tsx
import { Network, Search, Upload, Check, X, ChevronDown, ArrowRight, ArrowLeft, Plus } from 'lucide-react';
```

- [ ] **Step 2: Insert Header UI**
Add the header div inside the main container, before the step rendering logic.

```typescript
// components/nodes/add-new-contract-node.tsx
return (
  <div className="relative w-96 bg-[#1b1b1b]/90 backdrop-blur-md border border-white/10 shadow-2xl rounded-none overflow-hidden">
    {/* Header */}
    <div className="bg-[#353535]/50 p-4 flex items-center justify-between border-b border-white/10">
      <div className="flex items-center gap-3">
        <Plus className="w-4 h-4 text-white" />
        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white">Add New Contract</span>
      </div>
    </div>
    
    {step === 'SOURCE' && renderSourceStep()}
    {/* ... rest of steps */}
  </div>
);
```

- [ ] **Step 3: Commit Header**

```bash
git add components/nodes/add-new-contract-node.tsx
git commit -m "feat: add persistent header to AddNewContractNode"
```

---

### Task 2: Implement Drag & Drop Logic

**Files:**
- Modify: `components/nodes/add-new-contract-node.tsx`

- [ ] **Step 1: Add `isDragging` State**

```typescript
// Inside AddNewContractNode component
const [isDragging, setIsDragging] = useState(false);
```

- [ ] **Step 2: Define Drag & Drop Handlers**

```typescript
// Inside AddNewContractNode component
const handleDragOver = (e: React.DragEvent) => {
  e.preventDefault();
  setIsDragging(true);
};

const handleDragLeave = () => {
  setIsDragging(false);
};

const handleDrop = async (e: React.DragEvent) => {
  e.preventDefault();
  setIsDragging(false);
  
  const file = e.dataTransfer.files[0];
  if (file && (file.name.endsWith('.sol') || file.name.endsWith('.txt'))) {
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const vars = parseSolidityVariables(content);
      setData({
        ...data,
        source: 'file',
        code: content,
        variables: vars,
        address: file.name // Use filename as address for now
      });
      setStep('MAPPING');
    };
    reader.readAsText(file);
  }
};
```

- [ ] **Step 3: Update `renderInputStep` for File Upload**
Apply handlers and conditional styling to the drop zone.

```typescript
// Inside renderInputStep in AddNewContractNode.tsx
// Replace the "File Upload" return section with:
return (
  <div className="p-6 space-y-6 text-center">
    <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-[#919191]">
      <button onClick={() => setStep('SOURCE')}><ArrowLeft className="w-3 h-3"/></button>
      File Upload
    </div>
    <div 
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`border border-dashed p-12 text-[10px] uppercase tracking-widest transition-all ${
        isDragging 
          ? 'border-white/40 bg-white/5 text-white' 
          : 'border-white/10 text-[#919191]'
      }`}
    >
      {isDragging ? 'Drop to Parse' : 'Drag & Drop .sol'}
    </div>
  </div>
);
```

- [ ] **Step 4: Verify parsing works with dropped content**
Ensure `parseSolidityVariables` is called correctly and state transitions to `MAPPING`.

- [ ] **Step 5: Commit DnD Logic**

```bash
git add components/nodes/add-new-contract-node.tsx
git commit -m "feat: implement functional drag and drop for AddNewContractNode"
```

---

### Task 3: Final Visual Polish

**Files:**
- Modify: `components/nodes/add-new-contract-node.tsx`

- [ ] **Step 1: Clean up "Saved" state background**
Ensure the "Saved" state styling doesn't conflict with the new header.

```typescript
// Update renderSavedStep to remove the inner bg-[#1b1b1b] if redundant
const renderSavedStep = () => (
  <div className=""> {/* Removed bg-#1b1b1b */}
    <div className="bg-green-500/10 p-4 border-b border-green-500/20 flex items-center justify-between">
      {/* ... */}
    </div>
    {/* ... */}
  </div>
);
```

- [ ] **Step 2: Commit Polish**

```bash
git add components/nodes/add-new-contract-node.tsx
git commit -m "style: polish AddNewContractNode wizard steps"
```
