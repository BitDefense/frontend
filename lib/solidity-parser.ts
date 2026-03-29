/**
 * Extracts storage variables from Solidity code.
 * 
 * @param code The Solidity code string to parse.
 * @returns An array of objects containing variable names and types.
 */
export function parseSolidityVariables(code: string): { name: string; type: string }[] {
  const regex = /(uint\d*|address|bool|mapping\(.*?\)|bytes\d*|string)\s+(?:public|private|internal)?\s*(\w+)\s*;/g;
  const matches: { name: string; type: string }[] = [];
  let match;

  while ((match = regex.exec(code)) !== null) {
    if (match[1] && match[2]) {
      matches.push({
        type: match[1],
        name: match[2]
      });
    }
  }

  return matches;
}
