# Add New Contract Node Address Validation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enforce manual transition in the `AddNewContractNode` by requiring both a contract address and file content (for local source) before moving to the mapping step.

**Architecture:** 
- Refine the `handleDrop` handler to only load file data without transitioning the wizard step.
- Update the `renderInputStep` component to include validation logic for enabling the "Continue" button.
- Ensure the address field doesn't get automatically overwritten by the filename unless it was already empty.

**Tech Stack:** React, TypeScript, Tailwind CSS, @xyflow/react.

---

### Task 1: Refine handleDrop Logic

**Files:**
- Modify: `components/nodes/add-new-contract-node.tsx`

- [ ] **Step 1: Modify `handleDrop` handler**
Remove the automatic `setStep('MAPPING')` and conditionally update the address only if it's currently empty.

```typescript
// Inside handleDrop in components/nodes/add-new-contract-node.tsx
const handleDrop = (e: React.DragEvent) => {
  e.preventDefault();
  setIsDragging(false);

  const file = e.dataTransfer.files[0];
  if (file && file.name.endsWith('.sol')) {
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const vars = parseSolidityVariables(content);
      setData(prev => ({
        ...prev,
        source: 'file',
        code: content,
        variables: vars,
        // Only use filename if address is currently empty
        address: prev.address || file.name 
      }));
      // REMOVED: setStep('MAPPING');
    };
    reader.readAsText(file);
  }
};
```

- [ ] **Step 2: Commit Logic Fix**

```bash
git add components/nodes/add-new-contract-node.tsx
git commit -m "fix: remove automatic step transition from handleDrop"
```

---

### Task 2: Implement Button Validation

**Files:**
- Modify: `components/nodes/add-new-contract-node.tsx`

- [ ] **Step 1: Update `renderInputStep` Validation**
Calculate `isInputValid` and use it to disable the continue button.

```typescript
// Inside renderInputStep in components/nodes/add-new-contract-node.tsx
const renderInputStep = () => {
  const isInputValid = data.address.trim() !== '' && (data.source === 'etherscan' || !!data.code);

  return (
    <div className="p-6 space-y-6">
      {/* ... previous UI elements ... */}
      
      <button 
        disabled={!isInputValid}
        onClick={() => {
          if (data.source === 'etherscan') {
            // Simulated fetch of Example contract
            const exampleCode = `contract Example { public uint256 totalSupply; constructor() { totalSupply = 1 ether; } }`;
            const vars = parseSolidityVariables(exampleCode);
            setData({...data, code: exampleCode, variables: vars});
          }
          setStep('MAPPING');
        }}
        className="w-full bg-white text-black py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-neutral-200 disabled:opacity-30 disabled:cursor-not-allowed"
      >
        {data.source === 'etherscan' ? 'Download & Parse' : 'Continue to Mapping'}
      </button>
    </div>
  );
};
```

- [ ] **Step 2: Update Drop Area Feedback**
Ensure the drop area correctly reflects when a file is loaded vs when one is being dragged.

```typescript
// Inside renderInputStep's file drop area in components/nodes/add-new-contract-node.tsx
{data.source === 'file' ? (
  <div 
    onDragOver={handleDragOver}
    onDragLeave={handleDragLeave}
    onDrop={handleDrop}
    className={`border border-dashed p-8 text-[10px] text-center uppercase tracking-widest transition-all ${
      isDragging 
        ? 'border-white/40 bg-white/5 text-white' 
        : data.code 
          ? 'border-green-500/30 bg-green-500/5 text-white'
          : 'border-white/10 text-[#919191]'
    }`}
  >
    {data.code ? (
      <div className="flex flex-col items-center gap-2">
        <Check className="w-4 h-4 text-green-400" />
        <span className="text-white">File Loaded</span>
      </div>
    ) : (
      isDragging ? 'Drop to upload' : 'Drag & Drop .sol'
    )}
  </div>
) : null}
```

- [ ] **Step 3: Commit Validation Fix**

```bash
git add components/nodes/add-new-contract-node.tsx
git commit -m "feat: enforce address and file validation in AddNewContractNode"
```
