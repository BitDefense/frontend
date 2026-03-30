# Relationship Management Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Synchronize edge linking and unlinking with the backend API.

**Architecture:** Update `lib/api.ts` with link/unlink methods. Implement `onConnect` and `onEdgesDelete` in `FlowCanvas` to call these methods based on node types.

**Tech Stack:** Next.js, React Flow, Fetch API, TypeScript.

---

### Task 1: API Client Relationship Methods

**Files:**
- Modify: `lib/api.ts`

- [ ] **Step 1: Add link/unlink methods to `api` object**

```typescript
export const api = {
  // ... existing methods
  linkDashboardContract: (dashboardId: number, contractId: number) => 
    apiFetch<any>(`/dashboards/${dashboardId}/contracts/${contractId}`, { method: 'POST' }),
  unlinkDashboardContract: (dashboardId: number, contractId: number) => 
    apiFetch<any>(`/dashboards/${dashboardId}/contracts/${contractId}`, { method: 'DELETE' }),
  linkContractInvariant: (contractId: number, invId: number) => 
    apiFetch<any>(`/contracts/${contractId}/invariants/${invId}`, { method: 'POST' }),
  unlinkContractInvariant: (contractId: number, invId: number) => 
    apiFetch<any>(`/contracts/${contractId}/invariants/${invId}`, { method: 'DELETE' }),
  linkInvariantAction: (invId: number, actionId: number) => 
    apiFetch<any>(`/invariants/${invId}/defense-actions/${actionId}`, { method: 'POST' }),
  unlinkInvariantAction: (invId: number, actionId: number) => 
    apiFetch<any>(`/invariants/${invId}/defense-actions/${actionId}`, { method: 'DELETE' }),
};
```

- [ ] **Step 2: Commit**

```bash
git add lib/api.ts
git commit -m "feat: add relationship methods to API client"
```

---

### Task 2: Implement Relationship Synchronization in FlowCanvas

**Files:**
- Modify: `components/flow-canvas.tsx`

- [ ] **Step 1: Implement `handleLinkNodes` helper and update `onConnect` and `addNode`**

```tsx
// Inside FlowCanvasInner
const handleLinkNodes = useCallback(async (sourceId: string, targetId: string) => {
  const sourceNode = getNode(sourceId);
  const targetNode = getNode(targetId);
  if (!sourceNode || !targetNode) return;

  const sourceBackendId = sourceNode.data?.backendId;
  const targetBackendId = targetNode.data?.backendId;

  // We only link if both have backend IDs
  if (!sourceBackendId || !targetBackendId) return;

  try {
    if (sourceNode.type === 'addNewContract' && targetNode.type === 'invariant') {
      await api.linkContractInvariant(sourceBackendId, targetBackendId);
    } else if (sourceNode.type === 'invariant' && targetNode.type === 'defenseAction') {
      await api.linkInvariantAction(sourceBackendId, targetBackendId);
    }
    console.log(`Linked ${sourceId} to ${targetId}`);
  } catch (e) {
    console.error(`Failed to link nodes:`, e);
  }
}, [getNode]);

// Update onConnect
const onConnect = useCallback(
  (params: Connection) => {
    setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: '#fff', strokeWidth: 2 } }, eds));
    setConnectingNode(null);
    if (params.source && params.target) {
      handleLinkNodes(params.source, params.target);
    }
  },
  [setEdges, handleLinkNodes],
);

// Update addNode to handle Dashboard-Contract linking if applicable
// (And Contract-Invariant linking if created via context menu)
// ... Logic for Dashboard-Contract linking: Dashboard ID 1 is implicit.
```

- [ ] **Step 2: Implement `onEdgesDelete` to handle unlinking**

```tsx
const onEdgesDelete = useCallback(async (deletedEdges: Edge[]) => {
  for (const edge of deletedEdges) {
    const sourceNode = getNode(edge.source);
    const targetNode = getNode(edge.target);
    if (!sourceNode || !targetNode) continue;

    const sourceBackendId = sourceNode.data?.backendId;
    const targetBackendId = targetNode.data?.backendId;

    if (!sourceBackendId || !targetBackendId) continue;

    try {
      if (sourceNode.type === 'addNewContract' && targetNode.type === 'invariant') {
        await api.unlinkContractInvariant(sourceBackendId, targetBackendId);
      } else if (sourceNode.type === 'invariant' && targetNode.type === 'defenseAction') {
        await api.unlinkInvariantAction(sourceBackendId, targetBackendId);
      }
      console.log(`Unlinked ${edge.source} from ${edge.target}`);
    } catch (e) {
      console.error(`Failed to unlink nodes:`, e);
    }
  }
}, [getNode]);

// Add to ReactFlow props
// onEdgesDelete={onEdgesDelete}
```

- [ ] **Step 3: Handle Dashboard-Contract linking**
Special case: Whenever a `addNewContract` node is created, link it to Dashboard ID 1.

- [ ] **Step 4: Commit**

```bash
git add components/flow-canvas.tsx
git commit -m "feat: implement relationship synchronization in FlowCanvas"
```
