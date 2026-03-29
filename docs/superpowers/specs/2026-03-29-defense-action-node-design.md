# Design Spec: Defense Action Node

- **Date:** 2026-03-29
- **Topic:** Create `DefenseActionNode` with wizard flow for security actions
- **Status:** Draft

## 1. Overview
The `DefenseActionNode` is a terminal React Flow custom node (input only) used to define automated responses to invariant violations. It supports two primary paths: **Telegram Alert** (notifications) and **Pause Agent** (on-chain intervention via manual function calls).

## 2. Goals
- **Terminal Node:** Input port only, no output port.
- **Support Multiple Invariants:** Allow multiple connections from `InvariantNode` instances.
- **Branching Wizard UI:**
    - Path A: Telegram Alert -> Bot Connection -> Save.
    - Path B: Pause Agent -> Role Assignment -> Manual Function/Args -> Save.
- **Visual Consistency:** Align with `AddNewContractNode` and `InvariantNode` styling (`w-96`, persistent header, etc.).

## 3. Architecture & Implementation

### A. Node Structure & Styling
- **Header:** Persistent header with `ShieldAlert` icon (Lucide) + "ADD DEFENSE ACTION" text (Uppercase, `text-[11px]`, `font-bold`, `tracking-[0.2em]`, `bg-[#353535]/50`).
- **Ports:**
    - **Input (Target):** Positioned on the left. Supports multiple connections.
    - **Output:** None (Terminal node).
- **Styling:** Consistent with established node patterns (`w-96`, backdrop-blur, border-white/10).

### B. Wizard Steps (`DefenseStep`)
1.  **`SELECT_TYPE`**: Choose between "Telegram Alert" and "Pause Agent".
2.  **`TELEGRAM_CONFIG`**: Input field for Telegram Bot Token/Chat ID.
3.  **`PAUSE_ROLE`**: Input for the emergency/pause role address.
4.  **`PAUSE_FUNCTION`**: Inputs for 4-byte function hex and arguments.
5.  **`SAVED`**: Summary of the defense action.

### C. Data Structure
```typescript
interface DefenseData {
  type: 'telegram' | 'pause' | null;
  telegram?: {
    botToken: string;
    chatId: string;
  };
  pause?: {
    roleAddress: string;
    functionHex: string; // e.g., 0xdeadbeef
    args: string;
  };
}
```

## 4. User Interface Design
- **Path Selection:** Large action buttons with icons (e.g., `MessageSquare` for Telegram, `CircleSlash` for Pause).
- **Manual Input:** Mono-spaced inputs for hex values and addresses.
- **Saved State:** A banner ("Defense Active") with a summary of the action type and configuration.

## 5. Integration
- **ContextMenu:** Add "Add Defense Action" to the canvas menu and the invariant connection menu.
- **Connection Logic:** Ensure `InvariantNode`'s `allowedFrom` logic includes `DefenseActionNode`.

## 6. Testing Strategy
- **Manual Verification:**
    1.  Create a `DefenseActionNode` from the canvas.
    2.  Complete the "Telegram Alert" wizard and verify the saved summary.
    3.  Create another node, complete the "Pause Agent" wizard with a 4-byte hex, and verify.
    4.  Verify multiple Invariant nodes can connect to the same Defense node.
