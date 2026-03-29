# Design Spec: Add New Contract Node Address Validation

- **Date:** 2026-03-29
- **Topic:** Enforce address validation before transitioning to mapping step in `AddNewContractNode`
- **Status:** Draft

## 1. Overview
This specification addresses a UX issue where dropping a file in the `AddNewContractNode` automatically transitions to the next step even if the contract address is missing. It enforces a manual "Continue" action that is only available when all required fields are valid.

## 2. Goals
- **Explicit Validation:** Prevent step transition until a contract address is provided.
- **Manual Control:** Remove automatic `setStep('MAPPING')` from the file drop handler.
- **Visual Feedback:** Disable the "Continue" button until the form is valid.

## 3. Architecture & Implementation

### A. Refine `handleDrop`
- **Behavior:** Update `code` and `variables` in state.
- **Change:** Remove `setStep('MAPPING')`.
- **Address Handling:** Do NOT overwrite `data.address` with the filename if the user hasn't provided one. Keep the current `address` state or only use filename as a fallback `placeholder` if desired, but the state must remain empty unless explicitly set.

### B. Button Logic (`renderInputStep`)
- **Validation Criteria:**
    - `address`: Must be non-empty (after trim).
    - `source === 'file'`: Must have `code` loaded.
    - `source === 'etherscan'`: Must have `address`.
- **Implementation:**
    ```typescript
    const isInputValid = data.address.trim() !== '' && (data.source === 'etherscan' || !!data.code);
    ```
- **Button State:** `disabled={!isInputValid}`.

### C. UI Polish
- Ensure the file drop area clearly indicates when a file is loaded even if the user hasn't hit "Continue" yet.
- The button text should reflect the action (e.g., "Download & Parse" for Etherscan, "Continue to Mapping" for File).

## 4. Testing Strategy
- **Manual Verification:**
    1. Select "Local File" source.
    2. Drag and drop a `.sol` file. Verify the node stays on the `INPUT` step and the button is disabled.
    3. Type an address. Verify the button becomes enabled.
    4. Click "Continue to Mapping" and verify transition.
    5. Repeat for Etherscan: Verify button is disabled until an address is entered.
