# Design Spec: Add New Contract Node Header & DnD

- **Date:** 2026-03-29
- **Topic:** Add persistent header and functional drag-and-drop to `AddNewContractNode`
- **Status:** Draft

## 1. Overview
This specification covers two critical enhancements to the `AddNewContractNode`:
1.  **Persistent Header:** A consistent UI element that identifies the node's purpose across all wizard steps.
2.  **Functional Drag & Drop:** Implementing actual file handling logic for the "Local File" upload step.

## 2. Goals
- **Visual Consistency:** Align the `AddNewContractNode` header with the `ActionNode` styling.
- **Improved UX:** Provide clear visual feedback during file drag operations.
- **Automation:** Automatically parse Solidity code from dropped files and transition to the mapping step.

## 3. Architecture & Implementation

### A. Header Component
- **Structure:** A fixed `div` at the top of the node container.
- **Styling:**
    - Background: `bg-[#353535]/50`
    - Padding: `p-4`
    - Border: `border-b border-white/10`
    - Content: `Plus` icon (Lucide) + "ADD NEW CONTRACT" text (Uppercase, `text-[11px]`, `font-bold`, `tracking-[0.2em]`).

### B. Drag & Drop Logic (Local File Step)
- **State Changes:** Add `isDragging` boolean to the node state.
- **Event Handlers:**
    - `onDragOver`: Prevent default browser behavior, set `isDragging` to true.
    - `onDragLeave`: Set `isDragging` to false.
    - `onDrop`: 
        1. Prevent default.
        2. Extract `File` from `event.dataTransfer.files[0]`.
        3. Validate extension is `.sol`.
        4. Read file content using `FileReader`.
        5. Call `parseSolidityVariables(content)`.
        6. Update `data` state with code and variables.
        7. Transition `step` to `'MAPPING'`.
- **UI Feedback:** 
    - Change border color to `border-white/40` and background to `bg-white/5` when `isDragging` is true.

## 4. User Interface Refinement
- The header will remain visible even as the wizard body content changes (Source -> Input -> Mapping -> Saved).
- In the "Saved" state, the header will still be present, maintaining a unified "node" identity.

## 5. Testing Strategy
- **Manual Verification:**
    - Drag a `.sol` file onto the node and ensure it transitions to the mapping step.
    - Verify variables are correctly parsed from the dropped file.
    - Verify the header is visible and correctly styled in all steps.
