import 'dotenv/config';
import { REST } from "@discordjs/rest"
import { Routes } from "discord-api-types/v9"
import { readFile } from "fs/promises"
import { readCommandsRecursive } from '../src/util';

const TOKEN = process.env.BOT_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

if (TOKEN && CLIENT_ID && GUILD_ID) {

    const rest = new REST({ version: '9' }).setToken(TOKEN);
    const commands: string[] = [];
    let commandFiles: string[] = [];
    const commandPath = "./src/commands";
    
    (async () => {
        try {
            readCommandsRecursive(commandPath, commandFiles);

            commandFiles = commandFiles.filter(file => file.endsWith('.ts'));
            console.log(commandFiles)
            for (const filePath of commandFiles) {
                const command = await import(`..\\${filePath}`);
                commands.push(command.default.data.toJSON());
            }
        } catch (error) {
            console.error(error);
        }
    })();
    
    (async () => {
        try {
            console.log('Started refreshing application (/) commands.');
            if(commands)
            {
                await rest.put(
                    Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands },
                );
            }

            console.log('Successfully reloaded application (/) commands.');
        } catch (error) {
            console.error(error);
        }
    })();
}