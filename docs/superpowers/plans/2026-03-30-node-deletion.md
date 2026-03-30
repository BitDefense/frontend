# Node Deletion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Synchronize React Flow node deletions with the backend API.

**Architecture:** Update `lib/api.ts` with delete methods. Implement `onNodesDelete` in `FlowCanvas` to call these methods for each deleted node with a `backendId`.

**Tech Stack:** Next.js, React Flow, Fetch API, TypeScript.

---

### Task 1: API Client Delete Methods

**Files:**
- Modify: `lib/api.ts`

- [ ] **Step 1: Add delete methods for Contract, Invariant, and DefenseAction**

```typescript
export const api = {
  // ... existing methods
  deleteContract: (id: number) => apiFetch<any>(`/contracts/${id}`, { method: 'DELETE' }),
  deleteInvariant: (id: number) => apiFetch<any>(`/invariants/${id}`, { method: 'DELETE' }),
  deleteDefenseAction: (id: number) => apiFetch<any>(`/defense-actions/${id}`, { method: 'DELETE' }),
};
```

- [ ] **Step 2: Commit**

```bash
git add lib/api.ts
git commit -m "feat: add delete methods to API client"
```

---

### Task 2: Implement onNodesDelete in FlowCanvas

**Files:**
- Modify: `components/flow-canvas.tsx`

- [ ] **Step 1: Implement `onNodesDelete` handler**

```tsx
// Inside FlowCanvasInner
const onNodesDelete = useCallback(async (deletedNodes: any[]) => {
  for (const node of deletedNodes) {
    const backendId = node.data?.backendId;
    if (!backendId) continue;

    try {
      if (node.type === 'addNewContract') {
        await api.deleteContract(backendId);
      } else if (node.type === 'invariant') {
        await api.deleteInvariant(backendId);
      } else if (node.type === 'defenseAction') {
        await api.deleteDefenseAction(backendId);
      }
      console.log(`Deleted node ${node.id} from backend (ID: ${backendId})`);
    } catch (e) {
      console.error(`Failed to delete node ${node.id} from backend:`, e);
    }
  }
}, []);

// Add to ReactFlow props
// onNodesDelete={onNodesDelete}
```

- [ ] **Step 2: Commit**

```bash
git add components/flow-canvas.tsx
git commit -m "feat: synchronize node deletions with backend"
```
