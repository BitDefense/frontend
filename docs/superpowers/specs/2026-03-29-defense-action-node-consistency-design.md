# Design Spec: Defense Action Node Consistency

- **Date:** 2026-03-29
- **Topic:** Align `DefenseActionNode` UI/UX with `AddNewContractNode` and `InvariantNode`
- **Status:** Approved

## 1. Overview
The `DefenseActionNode` currently has several UI discrepancies compared to the other nodes in the system (Contract and Invariant). This specification aligns its visual design—specifically the "SAVED" banner, edit buttons, and form inputs—to ensure a unified design language across the flow canvas.

## 2. Goals
- **Consistent Banner Styling:** Use the low-opacity background and border pattern for the success banner.
- **Standardized Edit Button:** Remove unique styling (underlines) and match the small, uppercase action button pattern.
- **Synchronized Form Inputs:** Match the background color and border focus states used in other wizard steps.
- **Header Alignment:** Hide the "ADD DEFENSE ACTION" header when the node is in the `SAVED` state.
- **Typographic Harmony:** Use `tracking-[0.2em]` consistently for all uppercase labels and buttons.

## 3. Architecture & Implementation

### A. Header & State Visibility
- **Header:** Modify the header renderer to return `null` when `step === 'SAVED'`, matching `AddNewContractNode` and `InvariantNode`.

### B. "SAVED" State Banner Refactoring
- **Color Palette:**
    - Background: Change `bg-red-600` to `bg-red-500/10`.
    - Border: Add `border-b border-red-500/20`.
- **Edit Button:**
    - Styling: Remove `underline`, `underline-offset-4`, and `text-white/70`.
    - New Style: `text-[9px] text-[#919191] hover:text-white uppercase tracking-[0.2em]`.

### C. Form Input Synchronization
- **Input Background:** Change `bg-[#131313]` to `bg-black/40` (matching `AddNewContractNode`'s address input).
- **Focus State:** Change `focus:border-red-500/50` to `focus:border-white/20`.
- **Labels:** Ensure all labels use `text-[9px] font-mono text-[#919191] uppercase px-1 tracking-[0.2em]`.

### D. Visual Polish
- Ensure the `ShieldAlert` icon in the header uses the correct color (white or muted grey depending on the step) to match `InvariantNode`.
- Standardize the spacing and internal padding of all step renderers.

## 4. User Interface Details
- The "Defense Active" state will now feel identical in structure to "Contract Added" and "Invariant Active", using color (red) as the only differentiator.
- Form steps will feel consistent with the "Input Details" step of the Contract node.

## 5. Testing Strategy
- **Manual Verification:**
    1.  Compare the "SAVED" banners of all three nodes side-by-side.
    2.  Verify form input focus states and background colors match between the Contract node and Defense node.
    3.  Verify the Edit button placement and styling is identical across all nodes.
    4.  Verify the header is hidden in the `SAVED` state.
