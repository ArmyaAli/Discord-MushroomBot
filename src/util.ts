import fs from "fs"
import path from "path";

// recursivly walks a directory & all subdirs 
export const readCommandsRecursive = (commandContext: string, commandFiles: string[]) => {
    fs.readdirSync(commandContext).forEach((file) => {
        const Absolute = path.join(commandContext, file);
        if (fs.statSync(Absolute).isDirectory())
            return readCommandsRecursive(Absolute, commandFiles);
        else
            return commandFiles.push(Absolute);
    });
}