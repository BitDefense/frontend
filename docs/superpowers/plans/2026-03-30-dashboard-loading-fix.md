# Dashboard Loading and Data Mapping Fix Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix `Invariant` and `DefenseAction` data mapping and implement full dashboard restoration from the backend.

**Architecture:** 
- Update `onNodeSave` in `FlowCanvas` to correctly map `Invariant` (contract address from parent) and `DefenseAction` (all params).
- Update `app/dashboard/page.tsx` to fetch dashboard data and pass it to `FlowCanvas`.
- Implement data transformation in `FlowCanvas` to recreate nodes and edges from backend responses.

**Tech Stack:** Next.js, React Flow, Fetch API, TypeScript.

---

### Task 1: Fix Node Data Mapping in FlowCanvas

**Files:**
- Modify: `components/flow-canvas.tsx`

- [ ] **Step 1: Update `onNodeSave` to correctly map Invariants and Defense Actions**

```tsx
// Inside onNodeSave
} else if (node.type === 'invariant') {
  // Find parent contract node to get address
  const parentEdge = getEdges().find(e => e.target === nodeId);
  const parentNode = parentEdge ? getNode(parentEdge.source) : null;
  const contractAddress = parentNode?.data?.address || '0x0';

  result = await api.saveInvariant({
    contract: contractAddress,
    type: data.operator, // Use the comparison symbol
    target: data.threshold, // Threshold value
    storage: '0x0',
    slot_type: data.selectedVarType,
    network: 'ethereum'
  }, backendId);
} else if (node.type === 'defenseAction') {
  result = await api.saveDefenseAction({
    type: data.actionType,
    network: 'ethereum',
    tg_api_key: data.params.botToken || null,
    tg_chat_id: data.params.chatId || null,
    role_id: data.params.roleAddress || null,
    function_sig: data.params.functionHex || null,
    calldata: data.params.args || null,
  }, backendId);
}
```

- [ ] **Step 2: Commit**

```bash
git add components/flow-canvas.tsx
git commit -m "fix: correct data mapping for invariants and defense actions"
```

---

### Task 3: Implement Dashboard Loading Logic

**Files:**
- Modify: `app/dashboard/page.tsx`
- Modify: `components/flow-canvas.tsx`

- [ ] **Step 1: Fetch and pass dashboard data in `app/dashboard/page.tsx`**

```tsx
// Inside Dashboard component
const [dashboardData, setDashboardData] = useState<any>(null);

useEffect(() => {
  async function init() {
    try {
      const data = await api.getDashboard(1);
      setDashboardData(data);
    } catch (e: any) {
      if (e.message === 'NOT_FOUND') {
        const data = await api.createDashboard({ name: 'Default Dashboard' });
        setDashboardData(data);
      }
    }
  }
  init();
}, []);

// Pass to FlowCanvas
<FlowCanvas initialData={dashboardData} />
```

- [ ] **Step 2: Implement transformation logic in `FlowCanvas`**

```tsx
// In FlowCanvas props
export function FlowCanvas({ initialData }: { initialData?: any })

// In FlowCanvasInner
useEffect(() => {
  if (!initialData) return;

  const newNodes: any[] = [];
  const newEdges: any[] = [];

  // Map Contracts
  initialData.contracts?.forEach((c: any, i: number) => {
    const nodeId = `contract-${c.id}`;
    newNodes.push({
      id: nodeId,
      type: 'addNewContract',
      position: { x: 100, y: 100 + i * 400 },
      data: { ...c, backendId: c.id, step: 'SAVED' }
    });

    // Map Invariants for this contract
    initialData.invariants?.filter((inv: any) => c.invariant_ids?.includes(inv.id)).forEach((inv: any, j: number) => {
      const invNodeId = `invariant-${inv.id}`;
      newNodes.push({
        id: invNodeId,
        type: 'invariant',
        position: { x: 500, y: 100 + j * 300 },
        data: { 
          ...inv, 
          backendId: inv.id, 
          step: 'SAVED',
          selectedVar: inv.target, // Note: backend target is threshold, but frontend selectedVar is name
          operator: inv.type,
          threshold: inv.target,
          selectedVarType: inv.slot_type
        }
      });
      newEdges.push({
        id: `e-${nodeId}-${invNodeId}`,
        source: nodeId,
        target: invNodeId,
        animated: true,
        style: { stroke: '#fff', strokeWidth: 2 }
      });

      // Map Defense Actions for this invariant
      initialData.defense_actions?.filter((da: any) => inv.defense_action_ids?.includes(da.id)).forEach((da: any, k: number) => {
        const daNodeId = `da-${da.id}`;
        newNodes.push({
          id: daNodeId,
          type: 'defenseAction',
          position: { x: 900, y: 100 + k * 300 },
          data: { 
            ...da, 
            backendId: da.id, 
            step: 'SAVED',
            actionType: da.type,
            params: {
              botToken: da.tg_api_key,
              chatId: da.tg_chat_id,
              roleAddress: da.role_id,
              functionHex: da.function_sig,
              args: da.calldata
            }
          }
        });
        newEdges.push({
          id: `e-${invNodeId}-${daNodeId}`,
          source: invNodeId,
          target: daNodeId,
          animated: true,
          style: { stroke: '#fff', strokeWidth: 2 }
        });
      });
    });
  });

  if (newNodes.length > 0) {
    setNodes(newNodes);
    setEdges(newEdges);
  }
}, [initialData, setNodes, setEdges]);
```

- [ ] **Step 3: Commit**

```bash
git add app/dashboard/page.tsx components/flow-canvas.tsx
git commit -m "feat: implement dashboard loading and state restoration"
```
