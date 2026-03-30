# Backend Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Persist BitDefense dashboard, contracts, invariants, and defense actions to the backend API.

**Architecture:** Centralized API client in `lib/api.ts`, dashboard initialization in `app/dashboard/page.tsx`, and shared persistence logic in `FlowCanvas`. Node components trigger saves via an `onSave` callback.

**Tech Stack:** Next.js, React Flow, Fetch API, TypeScript.

---

### Task 1: API Client Module

**Files:**
- Create: `lib/api.ts`

- [ ] **Step 1: Create `lib/api.ts` with base fetch logic and dashboard methods**

```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  if (!response.ok) {
    if (response.status === 404) throw new Error('NOT_FOUND');
    throw new Error(`API error: ${response.statusText}`);
  }
  return response.json();
}

export const api = {
  getDashboard: (id: number) => apiFetch<any>(`/dashboards/${id}`),
  createDashboard: (data: { name: string }) => apiFetch<any>('/dashboards', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  saveContract: (data: any, id?: number) => apiFetch<any>(id ? `/contracts/${id}` : '/contracts', {
    method: id ? 'PUT' : 'POST',
    body: JSON.stringify(data),
  }),
  saveInvariant: (data: any, id?: number) => apiFetch<any>(id ? `/invariants/${id}` : '/invariants', {
    method: id ? 'PUT' : 'POST',
    body: JSON.stringify(data),
  }),
  saveDefenseAction: (data: any, id?: number) => apiFetch<any>(id ? `/defense-actions/${id}` : '/defense-actions', {
    method: id ? 'PUT' : 'POST',
    body: JSON.stringify(data),
  }),
};
```

- [ ] **Step 2: Commit**

```bash
git add lib/api.ts
git commit -m "feat: add centralized API client"
```

---

### Task 2: Dashboard Initialization

**Files:**
- Modify: `app/dashboard/page.tsx`

- [ ] **Step 1: Implement dashboard ID 1 initialization on mount**

```tsx
import { api } from '@/lib/api';

// Inside Dashboard component
useEffect(() => {
  async function init() {
    try {
      await api.getDashboard(1);
      console.log('Dashboard 1 loaded');
    } catch (e: any) {
      if (e.message === 'NOT_FOUND') {
        await api.createDashboard({ name: 'Default Dashboard' });
        console.log('Dashboard 1 created');
      }
    }
  }
  init();
}, []);
```

- [ ] **Step 2: Commit**

```bash
git add app/dashboard/page.tsx
git commit -m "feat: initialize dashboard ID 1 on load"
```

---

### Task 3: Centralized Persistence Logic in FlowCanvas

**Files:**
- Modify: `components/flow-canvas.tsx`

- [ ] **Step 1: Implement `onNodeSave` callback and pass to nodeTypes**

```tsx
import { api } from '@/lib/api';

// Inside FlowCanvasInner
const onNodeSave = useCallback(async (nodeId: string, data: any) => {
  const node = getNode(nodeId);
  if (!node) return;

  let result;
  const backendId = node.data.backendId;

  if (node.type === 'addNewContract') {
    result = await api.saveContract({
      address: data.address,
      network: data.network,
      variables: data.variables.reduce((acc: any, v: any) => ({ ...acc, [v.name]: v.type }), {}),
    }, backendId);
  } else if (node.type === 'invariant') {
    result = await api.saveInvariant({
      contract: data.selectedVar, // Placeholder mapping
      type: 'threshold',
      target: data.selectedVar,
      storage: '0x0', // Placeholder
      slot_type: data.selectedVarType,
      network: 'ethereum'
    }, backendId);
  } else if (node.type === 'defenseAction') {
    result = await api.saveDefenseAction({
      type: data.actionType,
      network: 'ethereum',
      tg_api_key: data.params.botToken,
      tg_chat_id: data.params.chatId,
    }, backendId);
  }

  if (result?.id) {
    setNodes((nds) => nds.map((n) => n.id === nodeId ? { ...n, data: { ...n.data, backendId: result.id } } : n));
  }
}, [getNode, setNodes]);

// Update nodeTypes to include onNodeSave
const nodeTypes = useMemo(() => ({
  addNewContract: (props: any) => <AddNewContractNode {...props} onSave={(data: any) => onNodeSave(props.id, data)} />,
  invariant: (props: any) => <InvariantNode {...props} onSave={(data: any) => onNodeSave(props.id, data)} />,
  defenseAction: (props: any) => <DefenseActionNode {...props} onSave={(data: any) => onNodeSave(props.id, data)} />,
}), [onNodeSave]);
```

- [ ] **Step 2: Commit**

```bash
git add components/flow-canvas.tsx
git commit -m "feat: implement centralized onNodeSave logic"
```

---

### Task 4: Update Node Components to trigger onSave

**Files:**
- Modify: `components/nodes/add-new-contract-node.tsx`
- Modify: `components/nodes/invariant-node.tsx`
- Modify: `components/nodes/defense-action-node.tsx`

- [ ] **Step 1: Update AddNewContractNode to call onSave**

```tsx
// In AddNewContractNode props
{ id, data: initialData, onSave }: { id: string, data: any, onSave?: (data: any) => Promise<void> }

// In renderMappingStep Save button
onClick={async () => {
  if (onSave) await onSave(data);
  setStep('SAVED');
}}
```

- [ ] **Step 2: Update InvariantNode to call onSave**

```tsx
// In InvariantNode props
{ id, data: initialData, onSave }: { id: string, data: any, onSave?: (data: any) => Promise<void> }

// In renderSetThreshold Finish button
onClick={async () => {
  if (onSave) await onSave({ selectedVar, selectedVarType, operator, threshold });
  setStep('SAVED');
}}
```

- [ ] **Step 3: Update DefenseActionNode to call onSave**

```tsx
// In DefenseActionNode props
{ id, data: initialData, onSave }: { id: string, data: any, onSave?: (data: any) => Promise<void> }

// In renderTelegramConfig / renderPauseFunction Save buttons
onClick={async () => {
  if (onSave) await onSave({ actionType, params });
  setStep('SAVED');
}}
```

- [ ] **Step 4: Commit**

```bash
git add components/nodes/*.tsx
git commit -m "feat: trigger onSave from node components"
```
