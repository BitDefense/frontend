# Design Spec: Invariant Node

- **Date:** 2026-03-29
- **Topic:** Create `InvariantNode` with wizard flow and automated variable discovery
- **Status:** Draft

## 1. Overview
The `InvariantNode` is a React Flow custom node used to define security invariants for smart contracts. It follows a wizard pattern (Select Var -> Select Type -> Select Comparison -> Set Threshold -> Save) and depends on a connection from an `AddNewContractNode` to discover available storage variables.

## 2. Goals
- **Automated Variable Discovery:** Automatically fetch storage variables from the connected `AddNewContractNode`.
- **Sequential Wizard UI:** Guide the user through the process of defining an invariant.
- **Visual Consistency:** Align the `InvariantNode` header and styling with the existing node patterns.
- **Connection-Based Data Flow:** Ensure the node's state correctly updates when a connection is made or broken.

## 3. Architecture & Implementation

### A. Node Structure & Styling
- **Header:** Persistent header with `Shield` icon (Lucide) + "ADD INVARIANT" text (Uppercase, `text-[11px]`, `font-bold`, `tracking-[0.2em]`, `bg-[#353535]/50`).
- **Ports:**
    - **Input (Target):** Positioned on the left for connecting from a Contract node.
    - **Output (Source):** Positioned on the right for connecting to further nodes (e.g., Action nodes).
- **Styling:** Consistent with the `AddNewContractNode` and `ActionNode` (backdrop-blur, border-white/10, shadow-2xl).

### B. Wizard Steps (`WizardStep`)
1.  **`SELECT_VAR`**: A dropdown or list of variables extracted from the connected contract node.
2.  **`VARIABLE_TYPE`**: (Optional/Auto-detected) Confirm the variable type (e.g., `uint256`).
3.  **`SELECT_COMPARISON`**: Select an operator: `>=`, `<=`, `==`, `!=`, `>`, `<`.
4.  **`SET_THRESHOLD`**: Input field for the threshold value (e.g., `1000000`).
5.  **`SAVED`**: Final summary of the invariant (e.g., `totalSupply <= 1000000`).

### C. Connection Logic
- The `InvariantNode` will use the React Flow `useHandleConnections` and `useNodesData` hooks to dynamically retrieve variable data from the node connected to its input handle.

### D. Data Structure
```typescript
interface InvariantData {
  variableName: string;
  type: string;
  operator: string;
  threshold: string;
}
```

## 4. User Interface Design
- **Empty State:** If no contract is connected, show a placeholder: "Connect a Contract node to select variables."
- **Variable List:** Once connected, display the list of variables with their types (if available).
- **Success State:** A "Saved" banner similar to the `AddNewContractNode` summary.

## 5. Testing Strategy
- **Manual Verification:**
    1.  Connect an `AddNewContractNode` to an `InvariantNode`.
    2.  Verify that the variables from the contract appear in the invariant node's first step.
    3.  Complete the wizard and verify the final invariant summary.
    4.  Verify that breaking the connection clears or disables the variable selection.
