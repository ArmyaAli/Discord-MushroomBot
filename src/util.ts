import fs from "fs/promises"
import path from "path";

// recursivly walks a directory & all subdirs 

export const readFileTree = async (commands: string[], node: string): Promise<void> => {
  const context = path.join(`${path.dirname(__filename)}`, "commands");
  const nodeList = await fs.readdir(path.join(context, node), { withFileTypes: true });
  for (const _node of nodeList) {
    const fPath = path.join(path.join(context, node), _node.name);
    if (_node.isFile()) {
      commands.push(fPath);
    } else
      await readFileTree(commands, _node.name)
  }
}
