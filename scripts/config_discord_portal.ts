import 'dotenv/config';
import { REST } from "@discordjs/rest"
import { Routes } from "discord-api-types/v9"
import { readFileTree } from '../src/util';

const TOKEN = process.env.BOT_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

if (TOKEN && CLIENT_ID && GUILD_ID) {

    const rest = new REST({ version: '9' }).setToken(TOKEN);
    const commands: string[] = [];
    let commandFiles: string[] = [];

    (async () => {
        try {
            await readFileTree(commandFiles, "");

            commandFiles = commandFiles.filter(file => file.endsWith('.ts') || file.endsWith('.js'));

            for (const filePath of commandFiles) {
                const command = await import(filePath);
                if (command?.default?.data) {
                    commands.push(command?.default?.data?.toJSON());
                }
            }

            if (commands.length > 0) {
                console.log('Started refreshing application (/) commands.');
                await rest.put(
                    Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), 
                    { body: commands },
                ).then(res => console.log(res));
                console.log('Successfully reloaded application (/) commands.');
            }
        } catch (error) {
            console.error(error);
        }
    })();
}