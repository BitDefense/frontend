/**
 * Extracts storage variables from Solidity code.
 * 
 * @param code The Solidity code string to parse.
 * @returns An array of variable names found.
 */
export function parseSolidityVariables(code: string): string[] {
  const regex = /(?:uint\d*|address|bool|mapping\(.*?\)|bytes\d*|string)\s+(?:public|private|internal)?\s*(\w+)\s*;/g;
  const matches: string[] = [];
  let match;

  while ((match = regex.exec(code)) !== null) {
    if (match[1]) {
      matches.push(match[1]);
    }
  }

  return matches;
}
