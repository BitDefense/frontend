# Defense Action Node Consistency Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Align the `DefenseActionNode` UI/UX with `AddNewContractNode` and `InvariantNode` by standardizing the header visibility, success banner, and form input styling.

**Architecture:** Update the `DefenseActionNode` component to conditionally render the header, refactor the `SAVED` state banner, and synchronize the form input and label styling using Tailwind CSS.

**Tech Stack:** React, TypeScript, Tailwind CSS, Lucide React, @xyflow/react.

---

### Task 1: Conditional Header Rendering

**Files:**
- Modify: `components/nodes/defense-action-node.tsx:210-216`

- [ ] **Step 1: Update header to hide in SAVED state**

```tsx
// Around line 210 in components/nodes/defense-action-node.tsx
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
```

- [ ] **Step 2: Commit**

```bash
git add components/nodes/defense-action-node.tsx
git commit -m "style: hide DefenseActionNode header in SAVED state"
```

---

### Task 2: "SAVED" State Banner & Edit Button Refactoring

**Files:**
- Modify: `components/nodes/defense-action-node.tsx:162-177`

- [ ] **Step 1: Refactor the success banner and edit button**

```tsx
// Around line 162 in components/nodes/defense-action-node.tsx
  const renderSaved = () => (
    <>
      <div className="bg-red-500/10 p-4 border-b border-red-500/20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Zap className="w-4 h-4 text-red-400 animate-pulse" />
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white">Defense Active</span>
        </div>
        <button
          onClick={() => setStep('SELECT_TYPE')}
          className="text-[9px] text-[#919191] hover:text-white uppercase tracking-[0.2em]"
        >
          Edit
        </button>
      </div>
```

- [ ] **Step 2: Commit**

```bash
git add components/nodes/defense-action-node.tsx
git commit -m "style: align DefenseActionNode success banner and edit button"
```

---

### Task 3: Form Input & Label Synchronization

**Files:**
- Modify: `components/nodes/defense-action-node.tsx:84-159`

- [ ] **Step 1: Update input background, focus state, and label tracking**

In `renderTelegramConfig`, `renderPauseRole`, and `renderPauseFunction`:
- Change `bg-[#131313]` to `bg-black/40`
- Change `focus:border-red-500/50` to `focus:border-white/20`
- Ensure labels have `tracking-[0.2em]`

Example for `renderTelegramConfig`:
```tsx
// components/nodes/defense-action-node.tsx
        <div className="space-y-1.5">
          <label className="text-[9px] font-mono text-[#919191] uppercase px-1 tracking-[0.2em]">Bot Token</label>
          <input
            type="text"
            value={params.botToken || ''}
            onChange={(e) => setParams({ ...params, botToken: e.target.value })}
            placeholder="728471...:AAH_..."
            className="w-full bg-black/40 border border-white/10 px-3 py-2 text-[11px] font-mono text-white focus:outline-none focus:border-white/20 transition-colors"
          />
        </div>
```

- [ ] **Step 2: Commit**

```bash
git add components/nodes/defense-action-node.tsx
git commit -m "style: synchronize DefenseActionNode form inputs and labels"
```

---

### Task 4: Visual Polish & Padding

**Files:**
- Modify: `components/nodes/defense-action-node.tsx`

- [ ] **Step 1: Standardize header icon and step padding**

- Update `ShieldAlert` in the header to use `text-white` (already updated in Task 1).
- Ensure consistent `p-6` padding in all step renderers (already mostly present).

- [ ] **Step 2: Commit**

```bash
git add components/nodes/defense-action-node.tsx
git commit -m "style: final visual polish for DefenseActionNode"
```

---

### Self-Review

1. **Spec coverage:** All requirements from the spec (header visibility, banner styling, edit button, input styling, tracking) are addressed.
2. **Placeholder scan:** No "TBD" or placeholders.
3. **Type consistency:** No changes to component props or internal state types, ensuring compatibility.
