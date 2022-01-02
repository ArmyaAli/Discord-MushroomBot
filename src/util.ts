import fs from "fs/promises"
import path from "path";

// recursivly walks a directory & all subdirs 

export const readFileTree = async (commands: string[], node: string): Promise<void> => {
  const context = `${path.dirname(__filename)}\\commands`;
  const nodeList = await fs.readdir(`${context}\\${node}`, { withFileTypes: true });
  for (const _node of nodeList) {
    const fPath = path.join(`${__dirname}\\commands\\${node}`, _node.name);
    if (_node.isFile()) {
      commands.push(fPath);
    } else
      await readFileTree(commands, _node.name)
  }
}
