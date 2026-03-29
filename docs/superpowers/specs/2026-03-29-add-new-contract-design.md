# Design Spec: Add New Contract Node (Wizard)

- **Date:** 2026-03-29
- **Topic:** Refactor `ImportContractNode` into `AddNewContractNode`
- **Status:** Draft (Approved)

## 1. Overview
The `AddNewContractNode` is a React Flow custom node that guides the user through adding a smart contract to the Vault Protocol dashboard. It replaces the previous `ImportContractNode` and follows a sequential wizard pattern for selecting sources, inputting contract data, and mapping storage variables.

## 2. Goals
- **Sequential Wizard UI:** Direct step-by-step flow (Source -> Input -> Mapping -> Save).
- **Source Selection:** Support for both Etherscan (API-based download) and local `.sol` File upload.
- **Contract Parsing:** Automatically identify storage variables from the Solidity source code.
- **Manual Mapping:** Allow users to manually assign storage hashes to detected variables.

## 3. Non-Goals (MVP)
- **Real Etherscan API calls:** For the current MVP, simulated responses or example contract code will be used.
- **Full Solidity AST Parsing:** Basic but robust regex-based extraction of variables is sufficient for the MVP.
- **Automated Mapping:** Logic for auto-calculating storage slots is out of scope.

## 4. Architecture

### Component Structure
- `AddNewContractNode.tsx`: The main node container managing the wizard state.
- `SourceStep.tsx`: Selection UI (Etherscan vs. File).
- `InputStep.tsx`: Form for address/network (Etherscan) or file upload area.
- `MappingStep.tsx`: List of detected variables with input fields for hashes.
- `SummaryStep.tsx`: The "Saved" state displaying the final configuration.

### State Management
The node maintains an internal `wizardStep` and a `contractData` object:
```typescript
type WizardStep = 'SOURCE' | 'INPUT' | 'MAPPING' | 'SAVED';

interface ContractData {
  address: string;
  network: string;
  source: 'etherscan' | 'file' | null;
  code: string;
  variables: string[]; // Names of detected storage variables
  mappings: Record<string, string>; // Variable name -> Storage Hash
}
```

## 5. User Interface Design (Wizard Steps)

### Step 1: Source (`SOURCE`)
- **Title:** "Select Source"
- **Options:** 
  - "Etherscan API" (Icon: Search/Network)
  - "Local File" (Icon: Upload/File)

### Step 2: Input (`INPUT`)
- **If Etherscan:**
  - Fields for "Contract Address" and "Network" (dropdown).
  - Button: "Download Source".
- **If File:**
  - Drag-and-drop or click-to-upload area for `.sol` files.
  - Automatically proceed once a valid file is provided.

### Step 3: Mapping (`MAPPING`)
- **Title:** "Map Storage Variables"
- **UI:** A scrollable table or list inside the node.
- **Rows:** Each row shows the variable name (e.g., `totalSupply`) and a text input for the hash (e.g., `0x00...`).
- **Button:** "Save Contract".

### Step 4: Saved (`SAVED`)
- **Title:** "Add New Contract"
- **Summary:** Display icon, contract address (truncated), and number of variables mapped.
- **Action:** Option to "Edit Mapping" to return to Step 3.

## 6. Parsing Strategy (MVP)
The node will include a utility function `parseSolidityVariables(code: string): string[]`.
- Uses regex: `/(?:public|private|internal)?\s+(?:uint\d*|address|bool|mapping\(.*?\))\s+(?:public|private|internal)?\s*(\w+);/g`
- Specifically targets the `Example` contract structure: `public uint256 totalSupply;` -> `totalSupply`.

## 7. Testing Strategy
- **Unit Test (Utility):** Verify regex correctly extracts `totalSupply` from the `ContractExample.sol` content.
- **UI Test:** Verify clicking "Next" transitions the `wizardStep` and updates the node's visual state.
- **Integration Test:** Verify the final `mappings` object contains the user-entered hashes.
