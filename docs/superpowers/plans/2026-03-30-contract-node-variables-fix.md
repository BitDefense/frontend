# Fix Contract Node Variable Display Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ensure the Contract node correctly displays the number of mapped variables when loaded from the backend.

**Architecture:** 
- Update the hydration logic in `FlowCanvasInner` to correctly transform the backend `variables` (which are storage slot mappings) into the frontend `mappings` and `variables` structures.
- Map `c.variables` (Record<string, string>) to `data.mappings` and `data.variables` (Array<{name, type}>).

**Tech Stack:** Next.js, React Flow, Fetch API, TypeScript.

---

### Task 1: Update Hydration Logic in FlowCanvas

**Files:**
- Modify: `components/flow-canvas.tsx`

- [ ] **Step 1: Update the contract mapping in `React.useEffect`**

```tsx
// Inside React.useEffect triggered by initialData in FlowCanvasInner
initialData.contracts?.forEach((c: any, i: number) => {
  const nodeId = `contract-${c.id}`;
  
  // Transform backend variables (mappings) to frontend variables list
  const frontendVariables = Object.entries(c.variables || {}).map(([name, type]) => ({
    name,
    type: 'uint256' // Default type since backend currently only stores mapping
  }));

  newNodes.push({
    id: nodeId,
    type: 'addNewContract',
    position: { x: 100, y: 100 + i * 400 },
    data: { 
      ...c, 
      backendId: c.id, 
      step: 'SAVED',
      mappings: c.variables || {}, // Backend "variables" field is actually the mappings
      variables: frontendVariables // Need this for UI to count and display
    }
  });
  // ... rest of logic
```

- [ ] **Step 2: Commit**

```bash
git add components/flow-canvas.tsx
git commit -m "fix: correctly hydrate contract node variables and mappings from backend"
```
