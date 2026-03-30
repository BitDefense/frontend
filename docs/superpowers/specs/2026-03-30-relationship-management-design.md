# Relationship Management Integration Design

**Topic:** Backend Relationship Synchronization (Link/Unlink)
**Date:** 2026-03-30

## Goal
Synchronize React Flow edge connections and deletions with the backend API to manage relationships between dashboards, contracts, invariants, and defense actions.

## Relationship Mapping

| Source Node | Target Node | Action | API Endpoint |
|---|---|---|---|
| Dashboard (Implicit ID 1) | Contract | Link | `POST /dashboards/{id}/contracts/{contract_id}` |
| Dashboard (Implicit ID 1) | Contract | Unlink | `DELETE /dashboards/{id}/contracts/{contract_id}` |
| Contract | Invariant | Link | `POST /contracts/{id}/invariants/{inv_id}` |
| Contract | Invariant | Unlink | `DELETE /contracts/{id}/invariants/{inv_id}` |
| Invariant | DefenseAction | Link | `POST /invariants/{id}/defense-actions/{action_id}` |
| Invariant | DefenseAction | Unlink | `DELETE /invariants/{id}/defense-actions/{action_id}` |

## Architecture

### 1. API Client Updates (`lib/api.ts`)
Add methods for linking and unlinking entities:
- `linkDashboardContract(dashboardId, contractId)` / `unlinkDashboardContract(...)`
- `linkContractInvariant(contractId, invariantId)` / `unlinkContractInvariant(...)`
- `linkInvariantAction(invariantId, actionId)` / `unlinkInvariantAction(...)`

### 2. Synchronization Logic (`components/flow-canvas.tsx`)

#### A. Linking (onConnect & addNode)
When a connection is created:
1. Identify source and target node types.
2. Verify both nodes have a `backendId`.
3. Call the corresponding `link` API method.
4. If `addNode` creates a connection (e.g., from context menu), it must also trigger the link logic once both IDs are available.

#### B. Unlinking (onEdgesDelete)
When an edge is deleted:
1. Identify the source and target nodes connected by the edge.
2. Call the corresponding `unlink` API method.

## Success Criteria
- [ ] Connecting a Contract to an Invariant in the UI triggers a backend link request.
- [ ] Deleting an edge between an Invariant and a Defense Action triggers a backend unlink request.
- [ ] Dashboard ID 1 is correctly linked to newly added contracts.

## Testing Strategy
- Monitor Network tab in browser for `POST` and `DELETE` requests on specific relationship endpoints.
- Verify that state remains consistent after UI interactions.
