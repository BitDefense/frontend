# Node Deletion Integration Design

**Topic:** Backend Node Deletion Synchronization
**Date:** 2026-03-30

## Goal
Synchronize React Flow node deletions with the backend API to ensure that deleting a node in the UI also removes its corresponding entity from the database.

## Entities to Handle

| Node Type | Backend Entity | API Endpoint |
|---|---|---|
| `addNewContract` | Contract | `DELETE /contracts/{id}` |
| `invariant` | Invariant | `DELETE /invariants/{id}` |
| `defenseAction` | DefenseAction | `DELETE /defense-actions/{id}` |

## Architecture

### 1. API Client Updates (`lib/api.ts`)
Add methods for deleting entities:
- `deleteContract(id: number)`
- `deleteInvariant(id: number)`
- `deleteDefenseAction(id: number)`

### 2. Synchronization Logic (`components/flow-canvas.tsx`)

#### A. onNodesDelete
Implement the `onNodesDelete` handler for React Flow:
1. Iterate through deleted nodes.
2. Check if the node has a `backendId` in its data.
3. If `backendId` exists, call the corresponding `delete` API method based on the node type.
4. Note: Deleting a contract might implicitly delete its children (invariants/actions) depending on backend implementation. In the frontend, if the user deletes a group of nodes, React Flow will provide all of them in the `onNodesDelete` callback.

## Success Criteria
- [ ] Deleting a Contract node in the UI triggers `DELETE /contracts/{id}`.
- [ ] Deleting an Invariant node in the UI triggers `DELETE /invariants/{id}`.
- [ ] Deleting a Defense Action node in the UI triggers `DELETE /defense-actions/{id}`.

## Testing Strategy
- Monitor Network tab in browser for `DELETE` requests when nodes are removed using backspace or the context menu.
- Verify that state remains consistent after UI interactions.
