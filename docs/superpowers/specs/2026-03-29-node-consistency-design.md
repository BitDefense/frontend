# Design Spec: Node Consistency (Contract & Invariant)

- **Date:** 2026-03-29
- **Topic:** Harmonize UI/UX between `AddNewContractNode` and `InvariantNode`
- **Status:** Draft

## 1. Overview
The `InvariantNode` currently diverges from the `AddNewContractNode` in width, padding structure, and "SAVED" state layout. This spec aligns both nodes to a unified design language, specifically focusing on the header/banner consistency and the edit button placement.

## 2. Goals
- **Unified Width:** Set both nodes to `w-96` for visual balance on the canvas.
- **Consistent "SAVED" State:** Implement a top-aligned success banner with a small "Edit" button on the right in the `InvariantNode`, matching the `Contract` node.
- **Structural Alignment:** Move padding into individual step renderers to allow for full-bleed banners in the "SAVED" state.
- **Visual Harmony:** Match font sizes, tracking, and color patterns.

## 3. Architecture & Implementation

### A. Structural Refactoring (`InvariantNode`)
- **Container:** Change `w-80` to `w-96`.
- **Padding:** Remove the `p-6` from the main container's step wrapper.
- **Step Renderers:** Add `p-6` padding inside `renderSelectVar`, `renderSelectOperator`, and `renderSetThreshold` to maintain the content layout while allowing `renderSaved` to have a full-width top banner.

### B. "SAVED" State Harmonization
- **Contract Node (Existing):**
    - Banner: `bg-green-500/10`, `border-b border-green-500/20`.
    - Text: "Contract Added" (Left).
    - Action: "Edit" button (Right, small, `text-[9px]`).
- **Invariant Node (New):**
    - Banner: `bg-blue-500/10`, `border-b border-blue-500/20`.
    - Text: "Invariant Active" (Left).
    - Action: "Edit" button (Right, small, `text-[9px]`, `text-[#919191] hover:text-white uppercase`).
    - Summary Box: Keep the existing blue-themed current rule summary but remove the large "Edit Invariant" button at the bottom.

### C. Handle Styling
- Ensure both nodes use the same `Handle` styling (size, color, hover effects).

## 4. User Interface Details
- Both nodes will now feel like part of the same "Vault Protocol" design system.
- The transition between steps will feel identical in terms of spatial layout.

## 5. Testing Strategy
- **Manual Verification:**
    1.  Compare the widths of a Contract node and an Invariant node side-by-side.
    2.  Complete an Invariant wizard and verify the "SAVED" banner matches the style of the Contract node's banner.
    3.  Verify the "Edit" button on the Invariant node correctly returns the user to the selection step.
