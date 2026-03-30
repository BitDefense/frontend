# Backend Integration Design

**Topic:** Dashboard and Node Persistence Integration
**Date:** 2026-03-30

## Goal
Persist the BitDefense dashboard (ID 1), contracts, invariants, and defense actions to the backend API specified in `docs/openapi.json`.

## Architecture

### 1. API Client (`lib/api.ts`)
A centralized module to handle all communication with the backend.
- **Base URL:** From `process.env.NEXT_PUBLIC_API_URL` (default: `http://localhost:8000`).
- **Methods:**
  - `getDashboard(id: number)`: Fetch a dashboard.
  - `createDashboard(data: DashboardCreate)`: Create a dashboard.
  - `saveContract(data: ContractCreate, id?: number)`: POST or PUT a contract.
  - `saveInvariant(data: InvariantSchema, id?: number)`: POST or PUT an invariant.
  - `saveDefenseAction(data: DefenseActionCreate, id?: number)`: POST or PUT a defense action.

### 2. Dashboard Initialization (`app/dashboard/page.tsx`)
On component mount, initialize dashboard ID 1:
1. Attempt to fetch dashboard with ID 1.
2. If it fails (404), create it using `createDashboard({ name: 'Default Dashboard' })`.
3. Load initial nodes and edges if the backend provides them (future expansion).

### 3. Centralized Persistence (`components/flow-canvas.tsx`)
Implement a callback `onNodeSave` to manage node persistence:
- **Flow:** Node -> `onNodeSave` -> Backend API -> Node Data Update.
- **Logic:**
  - If node data has a backend `id`, use `PUT`.
  - Otherwise, use `POST` and update the node data with the returned `id`.
  - Handle errors and loading states (optional UI feedback).

### 4. Node Component Updates
Update `AddNewContractNode`, `InvariantNode`, and `DefenseActionNode` to:
- Accept `onSave: (data: any) => Promise<void>` prop.
- Trigger `onSave` when the "Save" or "Finish" button is clicked.
- Transition to the "SAVED" step only after successful persistence.

## Data Mapping

| Frontend Node Type | Backend Entity | API Path |
|---|---|---|
| `addNewContract` | Contract | `/contracts` |
| `invariant` | Invariant | `/invariants` |
| `defenseAction` | DefenseAction | `/defense-actions` |

## Success Criteria
- [ ] Dashboard ID 1 exists on the backend.
- [ ] Saving a contract node creates/updates a contract on the backend.
- [ ] Saving an invariant node creates/updates an invariant on the backend.
- [ ] Saving a defense action node creates/updates an action on the backend.
- [ ] API URL is configurable via environment variables.

## Testing Strategy
- Manual verification of network requests in the browser.
- Verify that reloading the page (after future loading logic is added) correctly identifies persisted entities.
