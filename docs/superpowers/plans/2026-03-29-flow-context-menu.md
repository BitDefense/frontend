# Flow Context Menu & Edge-Connected Creation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a right-click context menu and node creation during edge connection in the `FlowCanvas`, and remove the legacy `ActionNode`.

**Architecture:** 
- A custom `ContextMenu` component that handles node creation at specific coordinates.
- Integration with React Flow's `onPaneContextMenu`, `onConnectStart`, and `onConnectEnd` hooks for interactive creation.
- Contextual filtering logic based on connection source node type.

**Tech Stack:** React, TypeScript, Tailwind CSS, Lucide React, @xyflow/react.

---

### Task 1: Cleanup and Preparation

**Files:**
- Delete: `components/nodes/action-node.tsx`
- Modify: `components/flow-canvas.tsx`

- [ ] **Step 1: Delete ActionNode file**

```bash
rm components/nodes/action-node.tsx
```

- [ ] **Step 2: Remove ActionNode references from FlowCanvas**

```typescript
// components/flow-canvas.tsx
// REMOVE: import { ActionNode } from '@/components/nodes/action-node';

const nodeTypes = {
  addNewContract: AddNewContractNode,
  // REMOVE: action: ActionNode,
  invariant: InvariantNode,
};

// ... Update initialNodes if it uses 'action' type ...
```

- [ ] **Step 3: Commit Cleanup**

```bash
git add components/flow-canvas.tsx
git rm components/nodes/action-node.tsx
git commit -m "cleanup: remove legacy ActionNode"
```

---

### Task 2: Implement ContextMenu Component

**Files:**
- Create: `components/flow/context-menu.tsx`

- [ ] **Step 1: Create the ContextMenu UI**

```typescript
// components/flow/context-menu.tsx
'use client';

import React from 'react';
import { Plus, Shield } from 'lucide-react';

interface ContextMenuProps {
  x: number;
  y: number;
  onAddNode: (type: string) => void;
  onClose: () => void;
  filter?: string; // Type of node we're connecting from
}

export function ContextMenu({ x, y, onAddNode, onClose, filter }: ContextMenuProps) {
  const allOptions = [
    { type: 'addNewContract', label: 'Add Contract', icon: Plus, allowedFrom: [undefined] },
    { type: 'invariant', label: 'Add Invariant', icon: Shield, allowedFrom: [undefined, 'addNewContract'] },
  ];

  const options = allOptions.filter(opt => opt.allowedFrom.includes(filter));

  return (
    <div 
      className="fixed z-50 min-w-[180px] bg-[#1b1b1b]/95 backdrop-blur-md border border-white/10 shadow-2xl p-1"
      style={{ top: y, left: x }}
      onMouseLeave={onClose}
    >
      {options.map((opt) => (
        <button
          key={opt.type}
          onClick={() => { onAddNode(opt.type); onClose(); }}
          className="w-full flex items-center gap-3 p-3 hover:bg-white/5 transition-colors text-left group"
        >
          <opt.icon className="w-3.5 h-3.5 text-white/50 group-hover:text-white" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/70 group-hover:text-white">
            {opt.label}
          </span>
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Commit ContextMenu**

```bash
git add components/flow/context-menu.tsx
git commit -m "feat: implement ContextMenu component for flow"
```

---

### Task 3: Integrate Context Menu into FlowCanvas

**Files:**
- Modify: `components/flow-canvas.tsx`

- [ ] **Step 1: Add State and Handlers for Context Menu**

```typescript
// Inside FlowCanvas component
const [menu, setMenu] = useState<{ x: number, y: number, filter?: string } | null>(null);
const [connectingNode, setConnectingNode] = useState<string | null>(null);

const onPaneContextMenu = useCallback((event: React.MouseEvent) => {
  event.preventDefault();
  setMenu({ x: event.clientX, y: event.clientY });
}, []);

const onConnectStart = useCallback((_, { nodeId }) => {
  setConnectingNode(nodeId);
}, []);

const onConnectEnd = useCallback((event) => {
  if (!connectingNode) return;

  const targetIsPane = (event.target as Element).classList.contains('react-flow__pane');
  if (targetIsPane) {
    const sourceNode = nodes.find(n => n.id === connectingNode);
    setMenu({ 
      x: event.clientX, 
      y: event.clientY, 
      filter: sourceNode?.type 
    });
  }
}, [connectingNode, nodes]);
```

- [ ] **Step 2: Implement `addNode` Utility**

```typescript
// Inside FlowCanvas component
const addNode = useCallback((type: string) => {
  const id = `node-${nodes.length + 1}`;
  const newNode = {
    id,
    type,
    position: { x: menu?.x || 0, y: menu?.y || 0 }, // Will need projection for canvas coords
    data: {},
  };
  setNodes((nds) => nds.concat(newNode));
  
  if (connectingNode) {
    const newEdge = { id: `e-${connectingNode}-${id}`, source: connectingNode, target: id, animated: true };
    setEdges((eds) => eds.concat(newEdge));
  }
}, [nodes, setNodes, setEdges, menu, connectingNode]);
```

- [ ] **Step 3: Update ReactFlow Props and Render Menu**

```typescript
// Update ReactFlow props in JSX
<ReactFlow
  onPaneContextMenu={onPaneContextMenu}
  onConnectStart={onConnectStart}
  onConnectEnd={onConnectEnd}
  {/* ... other props ... */}
>
  {/* ... */}
</ReactFlow>
{menu && (
  <ContextMenu 
    x={menu.x} 
    y={menu.y} 
    filter={menu.filter} 
    onAddNode={addNode} 
    onClose={() => setMenu(null)} 
  />
)}
```

- [ ] **Step 4: Commit Canvas Integration**

```bash
git add components/flow-canvas.tsx
git commit -m "feat: integrate right-click menu and edge creation in FlowCanvas"
```
