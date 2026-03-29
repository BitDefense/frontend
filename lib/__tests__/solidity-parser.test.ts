import { parseSolidityVariables } from '../solidity-parser';

describe('solidity-parser', () => {
  it('should extract uint256 variable', () => {
    const code = 'uint256 public totalSupply;';
    expect(parseSolidityVariables(code)).toContain('totalSupply');
  });

  it('should extract address variable', () => {
    const code = 'address private owner;';
    expect(parseSolidityVariables(code)).toContain('owner');
  });

  it('should extract mapping variable', () => {
    const code = 'mapping(address => uint256) balances;';
    expect(parseSolidityVariables(code)).toContain('balances');
  });

  it('should extract bool variable', () => {
    const code = 'bool internal isPaused;';
    expect(parseSolidityVariables(code)).toContain('isPaused');
  });

  it('should extract from complex contract code', () => {
    const code = `
      // SPDX-License-Identifier: SEE LICENSE IN LICENSE
      pragma solidity ^0.8.0;

      contract Example {
          uint256 public totalSupply;
          mapping(address => uint256) public balances;
          address private owner;

          constructor() {
              totalSupply = 1 ether;
          }

          function attack(uint256 newTotalSupply) external {
              totalSupply = newTotalSupply;
          }
      }
    `;
    const variables = parseSolidityVariables(code);
    expect(variables).toContain('totalSupply');
    expect(variables).toContain('balances');
    expect(variables).toContain('owner');
  });

  it('should handle variables without visibility modifiers', () => {
    const code = 'uint256 count;';
    expect(parseSolidityVariables(code)).toContain('count');
  });

  it('should extract from the provided example contract', () => {
    const code = `
      contract Example {
          public uint256 totalSupply;
      }
    `;
    // Note: The regex provided expects the type before visibility. 
    // If the regex is strictly followed, it might not match this specific case.
    // However, the prompt says it SHOULD extract 'totalSupply' from this.
    const variables = parseSolidityVariables(code);
    expect(variables).toContain('totalSupply');
  });
});
