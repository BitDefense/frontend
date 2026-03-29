# Design Spec: Flow Context Menu & Edge-Connected Creation

- **Date:** 2026-03-29
- **Topic:** Implement right-click context menu and node creation during edge connection
- **Status:** Draft

## 1. Overview
This specification covers the implementation of a custom context menu for the React Flow canvas and the ability to create new nodes directly from an edge connection. It also includes the removal of the legacy `ActionNode`.

## 2. Goals
- **Context-Aware Menu:** Show all nodes when right-clicking the canvas, but filter based on source when creating from an edge.
- **Visual Consistency:** The context menu must follow the project's dark, minimalist aesthetic.
- **UX Improvement:** Streamline the node creation process.
- **Cleanup:** Remove the existing `ActionNode` implementation.

## 3. Architecture & Implementation

### A. Context Menu Component (`ContextMenu.tsx`)
- **Styling:** 
    - Background: `bg-[#1b1b1b]/95`
    - Border: `border border-white/10`
    - Backdrop: `backdrop-blur-md`
    - Item Hover: `hover:bg-white/5`
- **Behavior:** Positioned at the mouse coordinates of the right-click event.

### B. Canvas Right-Click (`onPaneContextMenu`)
- **Action:** Open context menu at mouse position.
- **Options:** 
    - "Add Contract Node"
    - "Add Invariant Node"

### C. Edge-Connected Creation (`onConnectEnd`)
- **Trigger:** When a user finishes dragging a connection from a port but doesn't drop it on another port.
- **Contextual Filtering:**
    - If dragging from an `AddNewContractNode` (source), show "Add Invariant Node".
    - (Future nodes will follow similar filtering rules).
- **Positioning:** Create the new node at the drop coordinates.

### D. Cleanup
- Delete `components/nodes/action-node.tsx`.
- Remove references to `ActionNode` in `components/flow-canvas.tsx`.

## 4. UI Design
- **Menu Items:** Each item will have an icon (Lucide) and a label in uppercase with tracking-widest (`text-[10px]`, `font-bold`).
- **Icons:** 
    - Contract: `Plus`
    - Invariant: `Shield`

## 5. Testing Strategy
- **Manual Verification:**
    1.  Right-click on the empty canvas and verify the full menu appears.
    2.  Click an option and verify the node is created at the mouse position.
    3.  Drag a connection from a Contract node and release it on the canvas. Verify the filtered menu appears.
    4.  Verify `ActionNode` is no longer available in the codebase or canvas.
