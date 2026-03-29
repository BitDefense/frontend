# Node Consistency (Contract & Invariant) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Synchronize the visual design and UX of `InvariantNode` to match `AddNewContractNode`, including width, padding structure, and the edit button pattern.

**Architecture:** 
- Refactor the `InvariantNode`'s container and padding to allow for full-bleed top banners.
- Align the `InvariantNode`'s "SAVED" banner and edit button to match the `AddNewContractNode`.
- Standardize the handles and typography across both components.

**Tech Stack:** React, TypeScript, Tailwind CSS, @xyflow/react.

---

### Task 1: Refactor InvariantNode Padding and Width

**Files:**
- Modify: `components/nodes/invariant-node.tsx`

- [ ] **Step 1: Synchronize Width and Main Container Padding**
Update the main container to `w-96` and remove the `p-6` from the step wrapper.

```typescript
// components/nodes/invariant-node.tsx
// ...
return (
  <div className="relative w-96 bg-[#1b1b1b]/90 backdrop-blur-md border border-white/10 shadow-2xl rounded-none group">
    {/* ... Handles ... */}
    {/* ... Header ... */}

    {/* Removed: p-6 min-h-[120px] */}
    <div className="min-h-[120px]">
      {/* Step renderers will now have their own padding */}
    </div>
  </div>
);
```

- [ ] **Step 2: Add Internal Padding to Step Renderers**
Update `renderSelectVar`, `renderSelectOperator`, and `renderSetThreshold` to include `p-6`.

```typescript
// components/nodes/invariant-node.tsx
const renderSelectVar = () => (
  <div className="p-6 space-y-4"> {/* Added p-6 */}
    {/* ... */}
  </div>
);

const renderSelectOperator = () => (
  <div className="p-6 space-y-4"> {/* Added p-6 */}
    {/* ... */}
  </div>
);

const renderSetThreshold = () => (
  <div className="p-6 space-y-4"> {/* Added p-6 */}
    {/* ... */}
  </div>
);
```

- [ ] **Step 3: Commit Structural Fix**

```bash
git add components/nodes/invariant-node.tsx
git commit -m "refactor: sync width and padding structure in InvariantNode"
```

---

### Task 2: Harmonize "SAVED" State Banner

**Files:**
- Modify: `components/nodes/invariant-node.tsx`

- [ ] **Step 1: Re-implement `renderSaved` banner and edit button**
Align the banner with the `Contract` node: top-aligned with a small "Edit" button.

```typescript
// components/nodes/invariant-node.tsx
const renderSaved = () => (
  <>
    {/* Full-bleed banner */}
    <div className="bg-blue-500/10 p-4 border-b border-blue-500/20 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Shield className="w-4 h-4 text-blue-400" />
        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white">Invariant Active</span>
      </div>
      <button 
        onClick={() => {
          setStep('SELECT_VAR');
          setThreshold(null);
        }} 
        className="text-[9px] text-[#919191] hover:text-white uppercase transition-colors"
      >
        Edit
      </button>
    </div>

    {/* Content with padding */}
    <div className="p-6">
      <div className="p-4 bg-white/5 border border-white/10 flex flex-col gap-2">
        <div className="text-[10px] uppercase tracking-widest text-[#919191] px-1">Current Rule</div>
        <div className="text-[13px] font-mono text-white flex items-center gap-2 flex-wrap px-1">
          <span className="text-blue-400">{selectedVar}</span>
          <span className="text-[#919191]">{operator}</span>
          <span className="text-white">{threshold}</span>
        </div>
      </div>
      <div className="mt-4 px-1 text-[9px] uppercase tracking-widest text-neutral-500">
        Type: {selectedVarType}
      </div>
    </div>
  </>
);
```

- [ ] **Step 2: Commit Visual Harmonization**

```bash
git add components/nodes/invariant-node.tsx
git commit -m "feat: align InvariantNode 'SAVED' banner and edit button with Contract node"
```

---

### Task 3: Final Visual Audit

**Files:**
- Modify: `components/nodes/add-new-contract-node.tsx`
- Modify: `components/nodes/invariant-node.tsx`

- [ ] **Step 1: Check handles and typography**
Ensure both nodes use the same Lucide icon sizes, font tracking (`tracking-[0.2em]`), and handle sizes/hover states.

- [ ] **Step 2: Commit Audit**

```bash
git add components/nodes/
git commit -m "style: final visual synchronization for Contract and Invariant nodes"
```
